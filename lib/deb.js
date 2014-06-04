(function() {
	Function.prototype.deb = function(desc) {
		var getColor = function() {
			return 'rgb(' + (Math.floor((256-180)*Math.random()) + 200) + ',' + (Math.floor((256-180)*Math.random()) + 200) + ',' + (Math.floor((256-180)*Math.random()) + 200) + ')';
		}
		var log = function(str, group, styles) {
			if(is_chrome) console[group ? 'group' : 'log']('%c' + str, 'background:' + bg + ';' + styles);
			else console[group ? 'group' : 'log'](str);
		}
		var groupEnd = function() {
			console.groupEnd();
		}
		var fnIn = function(stack, args, fn) {
			var fnDef = fn.toString().match(/^function\s*[^\(]*\(\s*([^\)]*)\)/m)[0];
			// in
		    if (stack[0].indexOf('Error') === 0) { stack = stack.slice(1); }
		    var mess = '{ ' + (stack[1] ? stack[1].trim() : '');
			log(desc + fnDef + ' ' + mess, grouping);
		    // arguments
		    if(grouping && args.length > 0) { log('arguments:'); }
		    if(args && args.length > 0) {
				for(var i=0; i<args.length; i++) {
					var a = typeof args[i] == 'function' ? 'function' : args[i];
					log('  (' + (i+1) + ') ' + a, false, 'color:#727272;font-size:10px;');
				}
			}
			// stack trace
			if(grouping && stack.length > 1) { log('stack trace:'); }
		    if(stack && stack.length > 1) {
				for(var i=1; i<stack.length; i++) {
					log('  ' + stack[i].trim(), false, 'color:#727272;font-size:10px;');
				}
			}
		}
		var fnOut = function(time) {
			log('} ' + (Date.now() - time) + 'ms');
			if(grouping) { groupEnd(); }
		}
		var fn =  this, 
			desc = desc ? desc + ': ' : '',
			indent = 0,
			bg = getColor(),
			grouping = console && console.group && console.groupEnd,
			is_chrome = navigator.userAgent.toLowerCase().indexOf('chrome') > -1;
		return function() {
			fnIn((new Error()).stack.split(/\n/), arguments, fn);
			var time = Date.now();
			var res = fn.apply(this, Array.prototype.slice.call(arguments, 0));
			fnOut(time);
			return res;
		}
	}
})();