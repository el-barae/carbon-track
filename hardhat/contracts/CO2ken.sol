// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract SimpleCO2ken is ERC20, Ownable {
    // Structure pour stocker les informations de chaque crédit
    struct CreditInfo {
        string projectId;
        string vintage;
        string certifier;
        bool verified;
    }
    
    // Mapping pour associer les adresses aux informations de crédit
    mapping(address => CreditInfo) public creditInfo;
    
    // Événements pour le suivi
    event CreditsMinted(address indexed to, uint256 amount, string projectId);
    event CreditsRetired(address indexed from, uint256 amount, string reason);
    
    // Constructeur
    constructor() ERC20("Simple Carbon Credit", "SCO2") Ownable(msg.sender) {}
    
    // Fonction pour mint des crédits carbone (seulement le owner)
    function mintCredits(
        address to,
        uint256 amount,
        string memory projectId,
        string memory vintage,
        string memory certifier
    ) external onlyOwner {
        _mint(to, amount);
        
        // Stocker les informations du crédit
        creditInfo[to] = CreditInfo({
            projectId: projectId,
            vintage: vintage,
            certifier: certifier,
            verified: true
        });
        
        emit CreditsMinted(to, amount, projectId);
    }
    
    // Fonction pour retirer (brûler) des crédits
    function retireCredits(uint256 amount, string memory reason) external {
        require(balanceOf(msg.sender) >= amount, "Insufficient balance");
        _burn(msg.sender, amount);
        emit CreditsRetired(msg.sender, amount, reason);
    }
    
    // Fonction pour vérifier un crédit (seulement le owner)
    function verifyCredit(address creditOwner, bool isVerified) external onlyOwner {
        creditInfo[creditOwner].verified = isVerified;
    }
}