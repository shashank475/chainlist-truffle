
var ChainList = artifacts.require("./ChainList.sol");

contract("ChainList", function(accounts){
  var ChainListInstance;
  var seller = accounts[1];
  var buyer = accounts[2];
  var articleName = "article 1";
  var articleDescription = "Description for article 1";
  var articlePrice = 10;

  it("should throw an exception if you try to buy an article when there is no article for sale yet ", function(){
    return ChainList.deployed().then(function(instance){
      ChainListInstance = instance;
      return ChainListInstance.buyArticle(1, {
      from: buyer,
      value: web3.toWei(articlePrice, "ether")
      })
    }).then(assert.fail)
    .catch(function(error){
      assert(true);
    }).then(function(){
      return ChainListInstance.getNumberOfArticles();
    }).then(function(data){
      assert.equal(data.toNumber(), 0, "number of articles must be 0");

    });
  });

  //buy an article that does not exist
  it("should throw an exception if you try to buy an article that does not exist", function(){
    return ChainList.deployed().then(function(instance){
      chainListInstance = instance;
      return chainListInstance.sellArticle(articleName, articleDescription, web3.toWei(articlePrice,"ether"),{from: seller});
    }).then(function(receipt){
      return chainListInstance.buyArticle(2, {from: seller, value: web3.toWei(articlePrice, "ether")});
    }).then(assert.fail)
    .catch(function(error){
      assert(true);
    }).then(function(){
    return  chainListInstance.articles(1);
    }).then(function(data){
      assert.equal(data[0].toNumber(), 1,"article id must be 1");
      assert.equal(data[1], seller, "seller must be" +seller);
      assert.equal(data[2], 0x0, "buyer must be empty");
      assert.equal(data[3], articleName, "article name must be " + articleName);
      assert.equal(data[4], articleDescription, "articleDescription must be " + articleDescription);
      assert.equal(data[5].toNumber(), web3.toWei(articlePrice, "ether"), "article price must be " + web3.toWei(articlePrice, "ether"));

    });
  });

  it("should throw an exception if you try buy your own article", function(){
    return ChainList.deployed().then(function(instance){
      ChainListInstance = instance;

      return ChainListInstance.buyArticle(1, {from: seller, value: web3.toWei(articlePrice, "ether")});
    }).then(assert.fail)
    .catch(function(error){
      assert(true);
    }).then(function(){
      return ChainListInstance.articles(1);
    }).then(function(data){
      assert.equal(data[0].toNumber(), 1, "article id must be 1 ");
      assert.equal(data[1], seller, "seller must be " + seller);
      assert.equal(data[2], 0x0, "buyer must be empty");
      assert.equal(data[3], articleName, "article name must be " + articleName);
      assert.equal(data[4], articleDescription, "article description must be " + articleDescription);
      assert.equal(data[5].toNumber(), web3.toWei(articlePrice, "ether"), "article price must be " + web3.toWei(articlePrice, "ether"));
    });
  });

  it("should throw an exception if you try buy an article for value different from its price", function(){
    return ChainList.deployed().then(function(instance){
      ChainListInstance = instance;
      return ChainListInstance.buyArticle(1, {from: buyer, value: web3.toWei(articlePrice + 1, "ether")});
    }).then(assert.fail)
    .catch(function(error){
      assert(true);
    }).then(function(){
      return ChainListInstance.articles(1);
    }).then(function(data){
      assert.equal(data[0].toNumber(), 1, "article id must be 1 ");
      assert.equal(data[1], seller, "seller must be " + seller);
      assert.equal(data[2], 0x0, "buyer must be empty");
      assert.equal(data[3], articleName, "article name must be " + articleName);
      assert.equal(data[4], articleDescription, "article description must be " + articleDescription);
      assert.equal(data[5].toNumber(), web3.toWei(articlePrice, "ether"), "article price must be " + web3.toWei(articlePrice, "ether"));
  });
  });

  it("should throw an exception if you try buy an article that already been sold", function(){
    return ChainList.deployed().then(function(instance){
      ChainListInstance = instance;
      return ChainListInstance.buyArticle(1, {from: buyer, value: web3.toWei(articlePrice, "ether")});
    }).then(function(){
      return ChainListInstance.buyArticle(1, {from: web3.eth.accounts[0], value: web3.toWei(articlePrice, "ether")});
    }).then(assert.fail)
    .catch(function(error){
      assert(true);
    }).then(function(){
      return ChainListInstance.articles(1);
    }).then(function(data){
      assert.equal(data[0].toNumber(), 1, "article id must be 1");
      assert.equal(data[1], seller, "seller must be " + seller);
      assert.equal(data[2], buyer, "buyer must be " + buyer);
      assert.equal(data[3], articleName, "article name must be " + articleName);
      assert.equal(data[4], articleDescription, "article description must be " + articleDescription);
      assert.equal(data[5].toNumber(), web3.toWei(articlePrice, "ether"), "article price must be " + web3.toWei(articlePrice, "ether"));
    });
  });

});
