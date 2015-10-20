#!/usr/bin/env casperjs

// npm -g install phantomjs
// npm -g install casperjs
// Reminder: PATH_NODE pointed to the correct node modules location please 


var utils = require('utils');
var casper = require('casper').create();

function getDomain (){
	if ( ! casper.cli.has(0)) {
	    casper.echo("No domain to check");
	    casper.exit();
	}
	var domain = casper.cli.get(0);
	return domain;
}


var urldomain=getDomain();

casper.start('http://toolbar.netcraft.com/site_report?url=' + urldomain);
casper.userAgent ('Mozilla/4.0 (compatible; MSIE 6.0; Windows NT 5.1)');

casper.then(function() {
	casper.echo("\n----- " + this.getTitle() + " -----\n");
	var historySelector = 'section[id="history_table"] table[class="TBtable"] tr';
	var historyInfo = this.getElementsInfo(historySelector);
	var historySize = Object.keys(historyInfo).length;
	var historyText = [];

	for (var i = 1; i < historySize; i++){
		historyText.push(historyInfo[i].text);
	}
	
    var data = historyText.map(function(str){
    	var filter= str.replace(/\x20\x20/g,"");
    	var items=filter.split("\n");
    	casper.echo ("\033[0;41m" + items[5] + "\033[0m (" + items[8] + ")");
    	casper.echo ("\033[0;44m\tOS:\033[0m\t" + items[6] + "\n\t\033[0;44mServer:\033[0m\t" + items[7] + "\n\t\033[0;44mISP:\033[0m\t" + items[3] + "\n");
    })
	    
})

casper.run();