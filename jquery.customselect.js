(function($){
	$.fn.customSelect = function(opts){
		return new CustomSelect($(this), opts);
	};
	var CustomSelect = function(el, opts){
		var that = this;
		var defaultOpts = {
			//data中的value和text分别对应dataValue和dataText的值
			'data' : [{'value': '1', 'text' : '第一个'},
				{'value': '2', 'text' : '第二个第二个第二个第二个'},
				{'value': '3', 'text' : '第三个'}],//string类型的值会被认为是地址
			'dataValue' : 'value',
			'dataText' : 'text',
			'submitName' : 'bxdcustomselect',
			'elementId' : 'bxdcustomselect',
			'defaultText' : '请选择',
			'onchange' : function(){
				//console.log(this);
			},
			'ondone': function(){
				
			}
		};
		this.options = $.extend(false,defaultOpts, opts);
		this.el = el;
		var optionlist, csinput,csspan;
		init();

		function init(){
			var hiddenInput = csinput = $('<input type="hidden" value="0"/>');
			var hsubmitName = trim(that.options.submitName);
			var helementId = trim(that.options.elementId);
			if(hsubmitName.length > 0){
				hiddenInput.attr('name', hsubmitName);
			}
			if(helementId.length > 0){
				hiddenInput.attr('id', helementId);
			}
			csspan = $('<span>'+ that.options.defaultText + '</span>');
			that.el.addClass('bxd_customselect_span')
				.append(hiddenInput)
				.append(csspan);
			var sOptions = initSelectOptions(function(d){
				optionlist = $(d);
				optionlist.width(that.el.width());
				that.el.append(optionlist);
			});
			optionlist.find('li').click(function(){
				var oldCsInputValue = csinput.val();
				setValue($(this).html(), $(this).attr(that.options.dataValue));
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
			that.options.ondone.call(that);
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
					result += '<li value="'+ d[i][that.options.dataValue] + '" title="'
						 + d[i][that.options.dataText] + '">' + d[i][that.options.dataText] + '</li>';
				}
			}
			return result;
		}
		
		//设置下拉框的值
		function setValue(t, v){
			csspan.html(t);
			csinput.val(v);
		}
		
		this.val = function(){
			if(arguments.length < 1){
				return csinput.val();
			}else{
				var v = arguments[0];
				var selectedLi = optionlist.children("li["+ that.options.dataValue + "='"+ v +"']");
				setValue(selectedLi.html(), selectedLi.attr(that.options.dataValue));
				return that;
			}
		}
	}
})(jQuery);
