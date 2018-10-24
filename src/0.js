window.GT = window.GT || {};

(function(){
    var offers = document.getElementsByClassName('lt-offer');
    var i = 0;

    var _addOffer = function(){
        var offer = offers[i];
        offer.scrollIntoView();

        if(offer.getElementsByClassName('lt-offer-not-added').length){
            offer.getElementsByClassName('lt-add-offer-gallery')[0].click();
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
            _addOffer();
        }
    };

    _addOffer();
})();
