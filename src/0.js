GT = {
    words: {
        doCare: [],
        dontCare: []
    }
};

GT.addAll = function(dontAsk){
    var SELECTORS = {
        COUPON_CENTER: {
            SAVINGS_VALUE: '.lt-savings-value'
        },
        DESCRIPTION: '.lt-description',
        EXPIRES_DATE: '.lt-expires-date',
        PERSONALIZED: {
            COMPETITOR_NAME: '.lt-competitor-name',
            COUPON_TITLE: '.lt-coupon-title',
            COUPON_TITLE_PRICE: '.lt-coupon-title-price'
        },
        TITLE: '.lt-coupon-ccpd-title'
    };

    GT.doCare = [];
    GT.dontCare = [];

    var offers = document.getElementsByClassName('lt-offer');
    var i = 0;
    var currentOfferEl = Ext.get(offers[i]);

    var _addOffer = function(){
        currentOfferEl.dom.scrollIntoView();

        if(currentOfferEl.down('.lt-offer-not-added')){
            currentOfferEl.down('.lt-add-offer-gallery').dom.click();
        }

        setTimeout(_checkIfCare, GT.delay || 200);
    }

    var _checkIfCare = function(){
        if(_titleOrDescriptionMatch(GT.words.doCare, 'lightblue', GT.doCare) || _titleOrDescriptionMatch(GT.words.dontCare, 'pink', GT.dontCare) || dontAsk) {
            _nextOffer();
        } else {
            setTimeout(_checkIfCare, 1000);
        }
    }

    var _lookForWord = function(subElSelector, wordsArray, bgColor, offerArray){
        var subEl = currentOfferEl.down(subElSelector).dom;
        var trimmedLoweredTextContent = subEl.textContent.trim().toLowerCase();
        var foundWords = wordsArray.filter(function(word){ return trimmedLoweredTextContent.indexOf(word) !== -1; });

        if(foundWords.length) {
            currentOfferEl.setStyle('background-color', bgColor);
            subEl.innerHTML = foundWords.reduce(function(textContent, foundWord){
                return textContent.replace(new RegExp('(' + foundWord + ')', 'ig'), '<i>$1</i>')
            }, subEl.textContent);
            offerArray.push(_currentOfferString());
        }

        return !!foundWords.length;
    };

    var _titleOrDescriptionMatch = function(wordsArray, bgColor, offerArray){
        return [SELECTORS.TITLE, SELECTORS.DESCRIPTION].reduce(function(foundWord, selector) {
            return foundWord || _lookForWord(selector, wordsArray, bgColor, offerArray);
        }, false);
    }

    var _nextOffer = function(){
        if(GT.stop){
            delete GT.stop;
            _onExit();
            return;
        }

        i++;

        if(i < offers.length){
            currentOfferEl = Ext.get(offers[i]);
            _addOffer();
        }else{
            _onExit();
        }
    }

    var _currentOfferString = function () {
        return [
            SELECTORS.EXPIRES_DATE, SELECTORS.TITLE, SELECTORS.DESCRIPTION,
            SELECTORS.PERSONALIZED.COUPON_TITLE, SELECTORS.PERSONALIZED.COUPON_TITLE_PRICE, SELECTORS.PERSONALIZED.COMPETITOR_NAME,
            SELECTORS.COUPON_CENTER.SAVINGS_VALUE
        ].reduce(function(strings, selector){
            var subEl = currentOfferEl.down(selector);
            var text = subEl && subEl.dom.textContent.trim();
            return text ? strings.concat([text]) : strings;
        }, []).join(' -+- ');
    }

    var _onExit = function(){
        console.log('exiting');
        GT.printArray(GT.doCare, true);
    }

    _addOffer();
};

GT.printArray = function(a, oneLinePerItem){
    var str = '';
    Ext.Array.each(a.sort(), function(item){
        str += '"' + item + '", ' + (oneLinePerItem ? '\n' : '');
    });
    console.log(str.trim());
};
