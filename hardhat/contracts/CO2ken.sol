// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract CO2ken is ERC20, Ownable {
    struct CreditInfo {
        string projectId;
        string vintage;
        string certifier;
        bool verified;
    }

    mapping(address => CreditInfo) public creditInfo;

    // Marketplace
    struct Listing {
        uint256 id;
        address seller;
        uint256 amount;
        uint256 pricePerToken; // in wei per token unit (token decimals = 6)
        bool active;
    }

    uint256 public nextListingId;
    mapping(uint256 => Listing) public listings;

    event CreditsMinted(address indexed to, uint256 amount, string projectId, string vintage, string certifier);
    event CreditsRetired(address indexed from, uint256 amount, string reason);
    event CreditVerified(address indexed holder, bool verified);
    event ListingCreated(uint256 indexed id, address indexed seller, uint256 amount, uint256 pricePerToken);
    event ListingPurchased(uint256 indexed id, address indexed buyer, uint256 amount, uint256 totalPrice);
    event ListingCancelled(uint256 indexed id);

    constructor() ERC20("Carbon Credit", "SCO2") Ownable(msg.sender) {}

    // Fractionalization: 6 decimals (0.000001 unit)
    function decimals() public pure override returns (uint8) {
        return 6;
    }

    // ----------------
    // Mint / Burn / Verify
    // ----------------
    function mintCredits(
        address to,
        uint256 amount,
        string memory projectId,
        string memory vintage,
        string memory certifier
    ) external onlyOwner {
        require(to != address(0), "Invalid address");
        require(amount > 0, "Amount must be > 0");

        _mint(to, amount);
        // Store simple metadata per holder (minimal design)
        creditInfo[to] = CreditInfo(projectId, vintage, certifier, false);
        emit CreditsMinted(to, amount, projectId, vintage, certifier);
    }

    function retireCredits(uint256 amount, string memory reason) external {
        require(amount > 0, "Amount must be > 0");
        _burn(msg.sender, amount);
        emit CreditsRetired(msg.sender, amount, reason);
    }

    function verifyCredit(address holder, bool isVerified) external onlyOwner {
        creditInfo[holder].verified = isVerified;
        emit CreditVerified(holder, isVerified);
    }

    // ----------------
    // Marketplace: create / buy / cancel
    // ----------------
    function createListing(uint256 amount, uint256 pricePerToken) external {
        require(balanceOf(msg.sender) >= amount, "Not enough credits");
        require(amount > 0, "Amount must be > 0");
        require(pricePerToken > 0, "Price must be > 0");

        // Escrow tokens in contract
        _transfer(msg.sender, address(this), amount);

        listings[nextListingId] = Listing({
            id: nextListingId,
            seller: msg.sender,
            amount: amount,
            pricePerToken: pricePerToken,
            active: true
        });

        emit ListingCreated(nextListingId, msg.sender, amount, pricePerToken);
        nextListingId++;
    }

    function buyListing(uint256 listingId) external payable {
        Listing storage lst = listings[listingId];
        require(lst.active, "Listing not active");

        uint256 totalPrice = lst.amount * lst.pricePerToken;
        require(msg.value == totalPrice, "Incorrect ETH amount sent");

        // Mark sold before external calls
        lst.active = false;

        // Transfer tokens to buyer
        _transfer(address(this), msg.sender, lst.amount);

        // Send ETH to seller
        (bool ok, ) = lst.seller.call{value: msg.value}("");
        require(ok, "Payment to seller failed");

        emit ListingPurchased(listingId, msg.sender, lst.amount, totalPrice);
    }

    function cancelListing(uint256 listingId) external {
        Listing storage lst = listings[listingId];
        require(lst.active, "Listing not active");
        require(lst.seller == msg.sender || msg.sender == owner(), "Not authorized");

        lst.active = false;

        // Return tokens to seller
        _transfer(address(this), lst.seller, lst.amount);

        emit ListingCancelled(listingId);
    }

    // Owner can withdraw accidental ETH
    function rescueETH(address payable to, uint256 amount) external onlyOwner {
        (bool ok, ) = to.call{value: amount}("");
        require(ok, "Rescue failed");
    }

    receive() external payable {}
    fallback() external payable {}


    function getActiveListings(uint256 start, uint256 end) 
        external 
        view 
        returns (
            uint256[] memory ids,
            address[] memory sellers,
            uint256[] memory amounts,
            uint256[] memory prices,
            bool[] memory actives
        ) 
    {
        if (end <= start || end > nextListingId) {
            // retourner des tableaux vides correctement
            uint256[] memory emptyIds;
            address[] memory emptySellers;
            uint256[] memory emptyAmounts;
            uint256[] memory emptyPrices;
            bool[] memory emptyActives;
            return (emptyIds, emptySellers, emptyAmounts, emptyPrices, emptyActives);
        }

        uint256 len = end - start;
        ids = new uint256[](len);
        sellers = new address[](len);
        amounts = new uint256[](len);
        prices = new uint256[](len);
        actives = new bool[](len);

        for (uint256 i = start; i < end; i++) {
            Listing memory l = listings[i];
            uint256 idx = i - start;
            ids[idx] = l.id;
            sellers[idx] = l.seller;
            amounts[idx] = l.amount;
            prices[idx] = l.pricePerToken;
            actives[idx] = l.active;
        }
    }
}
