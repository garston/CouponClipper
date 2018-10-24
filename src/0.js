window.GT = window.GT || {};

(function(){
    var offers = document.getElementsByClassName('lt-offer');
    var i = 0;
    var currentOfferEl = Ext.get(offers[i]);

    var _addOffer = function(){
        currentOfferEl.dom.scrollIntoView();

        if(currentOfferEl.down('.lt-offer-not-added')){
            currentOfferEl.down('.lt-add-offer-gallery').dom.click();
        }

        setTimeout(_nextOffer, GT.delay || 200);
    };

    var _nextOffer = function(){
        if(GT.stop){
            delete GT.stop;
            return;
        }

        i++;

        if(i < offers.length){
            currentOfferEl = Ext.get(offers[i]);
            _addOffer();
        }
    };

    _addOffer();
})();
