//SPDX-License-Identifier: MIT

pragma solidity ^0.8.4;

contract Advertion {
    event BidSuccess(address bidder, uint value, string imageLink);
    
    string public imageLink;
    uint public duration = 24*60*60;
    uint public endTime;
    uint public submitTime;
    uint public currentBid;

    function bid(string memory _imageLink) external payable{
        if(endTime<block.timestamp) currentBid = 0.001 * 10**9; 
        require(msg.value > currentBid, "Not Enought for bidding ");
        if(block.timestamp - submitTime < 15*60) {
            
        }
        
        imageLink = _imageLink;
        endTime = block.timestamp + duration;


        emit BidSuccess(msg.sender, msg.value, imageLink);
    }
}