(function($){
	$.fn.customSelect = function(opts){
		return new CustomSelect($(this), opts);
	};
	var CustomSelect = function(el, opts){
		var that = this;
		var defaultOpts = {
			//data中的value和text分别对应dataValue和dataText的值
			'data' : [
				{'value': '0', 'html' : '请选择'},
				{'value': '1', 'html' : '第一个'},
				{'value': '2', 'html' : '第二个第二个第二个第二个'},
				{'value': '3', 'html' : '第三个'},
				{'value': '4', 'html' : '第四个'},
				{'value': '5', 'html' : '第五个'},
				{'value': '6', 'html' : '第六个'}
			],//string类型的值会被认为是地址
			'value' : 'value',
			'html' : 'html',
			'name' : 'cbcustomselect',//submit name
			'id' : 'cbcustomselect',//element id
			'onchange' : function(){
				// console.log('change');
			},
			'ondone': function(){
				// console.log('done');
			}
		};
		this.options = $.extend(false,defaultOpts, opts);
		this.el = el;
		var optionlist, csinput,csspan;
		init();

		function init(){
			var hiddenInput = csinput = $('<input type="hidden"/>');
			var hsubmitName = trim(that.options['name']);
			var helementId = trim(that.options['id']);
			if(hsubmitName.length > 0){
				hiddenInput.attr('name', hsubmitName);
			}
			if(helementId.length > 0){
				hiddenInput.attr('id', helementId);
			}
			csspan = $('<span></span>');
			that.el.addClass('cb_customselect_span')
				.append(hiddenInput)
				.append(csspan);
			var sOptions = initSelectOptions(function(d){
				optionlist = $(d);
				optionlist.width(that.el.width());
				that.el.append(optionlist);
			});
			optionlist.find('li').click(function(){
				var oldCsInputValue = csinput.val();
				setValue($(this).html(), $(this).attr(that.options['value']));
				if(oldCsInputValue != csinput.val()){
					setTimeout(function(){
						that.options.onchange.call(that);
					}, 100);
				}
				if(optionlist.css('display') == 'none'){
					el.trigger('click');
				}
				el.trigger('mouseleave');
			});
			el.click(function(){
				optionlist.css({
					'top': that.el.offset().top + that.el.height(),
					'left': that.el.offset().left
				}).width($(this).width()).show();
			}).mouseleave(function(){
				optionlist.hide(200);
			});
			select(0).options.ondone.call(that);
		}
		function trim(str){
			if(!str){
				return '';
			}else{
				return str.replace(/(^\s*)|(\s*$)/g, '');
			}
		}
		function initSelectOptions(callback){
			if(typeof(that.options.data) == 'string'){
				$.ajax({
					'url' : that.options.data,
					'dataType' : 'json',
					'type': 'get',
					'success' : function(d){
						callback(createOptionLists(d));
					}
				});
			}else{
				callback(createOptionLists(that.options.data));
			}
		}
		function createOptionLists(d){
			var result = '';
			if(typeof(d) == 'object' && d instanceof Array){
				result = '<ul style="position: absolute; z-index: 999; display: none;">';
				for(var i = 0; i < d.length; i++){
					result += '<li value="'+ d[i][that.options['value']] + '" title="'
						 + d[i][that.options.html] + '">' + d[i][that.options.html] + '</li>';
				}
			}
			return result;
		}

		//设置下拉框的值
		function setValue(t, v){
			csspan.html(t);
			csinput.val(v);
			return that;
		}

		function select(index){
			var selectedLi = $(optionlist).children(':eq('+index+')');
			return setValue(selectedLi.html(), selectedLi.attr(that.options.value));
		}

		this.val = function(){
			if(arguments.length < 1){
				return csinput.val();
			}else{
				var v = arguments[0];
				var selectedLi = optionlist.children("li["+ that.options.value + "='"+ v +"']");
				return setValue(selectedLi.html(), selectedLi.attr(that.options.value));
			}
		}
		//根据索引选择
		this.select = function(index){
			return select(index);
		}
	}
})(jQuery);
