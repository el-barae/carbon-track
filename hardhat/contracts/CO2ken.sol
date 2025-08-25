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
        uint256 pricePerToken; 
        bool active;
    }

    uint256 public nextListingId;
    mapping(uint256 => Listing) public listings;

    event CreditsMinted(address indexed to, uint256 amount, string projectId, string vintage, string certifier);
    event CreditsRetired(address indexed from, uint256 amount, string reason);
    event CreditVerified(address indexed holder, bool verified);
    event ListingCreated(uint256 id, address seller, uint256 amount, uint256 pricePerToken);
    event ListingPurchased(uint256 id, address buyer, uint256 amount, uint256 totalPrice);
    event ListingCancelled(uint256 id);

    constructor() ERC20("Carbon Credit", "SCO2") Ownable(msg.sender) {}

    function decimals() public pure override returns (uint8) {
        return 6;
    }

    function mintCredits(
        address to,
        uint256 amount,
        string memory projectId,
        string memory vintage,
        string memory certifier
    ) external onlyOwner {
        _mint(to, amount);
        creditInfo[to] = CreditInfo(projectId, vintage, certifier, false);
        emit CreditsMinted(to, amount, projectId, vintage, certifier);
    }

    function retireCredits(uint256 amount, string memory reason) external {
        _burn(msg.sender, amount);
        emit CreditsRetired(msg.sender, amount, reason);
    }

    function verifyCredit(address holder, bool isVerified) external onlyOwner {
        creditInfo[holder].verified = isVerified;
        emit CreditVerified(holder, isVerified);
    }

    // Marketplace : buy / sell

    function createListing(uint256 amount, uint256 pricePerToken) external {
        require(balanceOf(msg.sender) >= amount, "Not enough credits");
        require(pricePerToken > 0, "Price must be > 0");

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
        require(lst.active, "Annonce inactive");

        uint256 totalPrice = lst.amount * lst.pricePerToken;
        require(msg.value == totalPrice, "ETH incorrect");

        // Marquer comme vendu
        lst.active = false;

        // Transférer les crédits au buyer
        _transfer(address(this), msg.sender, lst.amount);

        // Payer le vendeur
        payable(lst.seller).transfer(msg.value);

        emit ListingPurchased(listingId, msg.sender, lst.amount, totalPrice);
    }

    function cancelListing(uint256 listingId) external {
        Listing storage lst = listings[listingId];
        require(lst.active, "Listing inactive");
        require(lst.seller == msg.sender || msg.sender == owner(), "Not authorized");

        lst.active = false;
        _transfer(address(this), lst.seller, lst.amount);

        emit ListingCancelled(listingId);
    }
}
