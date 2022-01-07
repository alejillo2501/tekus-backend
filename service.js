const fetch = require('cross-fetch');
const d = new Date();
const month = d.getMonth()+1;
const year = d.getFullYear();
const endpoint = 'https://api.coinbase.com/v2/prices/BTC-USD/spot';

module.exports = {
    bitCointToday : async() => {
        
        const response = await fetch(endpoint, {
            method: 'GET'
        }).then((resp) => resp.json());
        
        var body = {
            date: d,
            data: response
        }
        return body;
    },
    bitCointLast15Days : async() =>{
        var cant = 15;
        var dayLast = d.getDate();
        var monthLast = month;
        var yearLast = year;

        var array = [];

        while (cant > 0) {
            dayLast--;

            if(dayLast == 0){
                monthLast--;
                if(monthLast == 0){
                    monthLast = 12;
                    yearLast--;
                }
                dayLast = daysMonth(monthLast, yearLast);
            }

            var dateLast = yearLast+'-'+monthLast+'-'+dayLast;

            const info = await fetch(endpoint+'?date='+dateLast, {
                method: 'GET'
            }).then((resp) => resp.json());
            
            if(info.data != undefined){
                var dLast = new Date(yearLast, monthLast-1, dayLast);

                var body = {
                    date:dLast,
                    info: info.data,
                    item: dateLast
                }

                array.push(body);
            }

            cant--;
        }

        return array;

    },
    bitCointByDate: async(item) => {

        const USD = await fetch('https://api.coinbase.com/v2/prices/BTC-USD/spot?date='+item, {
            method: 'GET'
        }).then((resp) => resp.json());

        const EUR = await fetch('https://api.coinbase.com/v2/prices/BTC-EUR/spot?date='+item, {
            method: 'GET'
        }).then((resp) => resp.json());

        const COP = await fetch('https://api.coinbase.com/v2/prices/BTC-COP/spot?date='+item, {
            method: 'GET'
        }).then((resp) => resp.json());

        var spItem = item.split('-');
        var dItem = new Date(spItem[0],spItem[1], spItem[2]);
        
        var body = {
            item: dItem,
            COP: COP.data,
            EUR: EUR.data,
            USD: USD.data
        }

        return body;
    }
}

function daysMonth(montCal, yearCal) {
	return new Date(yearCal, montCal, 0).getDate();
}