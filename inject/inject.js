// chrome.extension.sendMessage({}, function(response) {
    localStorage["greenwave_active"] = true;
	var readyStateCheckInterval = setInterval(function() {
	if (document.readyState === "complete") {
		clearInterval(readyStateCheckInterval);
        var selectedTarget=null;
        var block  = $('<div id="gw-block"/>').css({
            'position':'fixed',
            'top':'-1000px',
            'left':'-1000px',
            'width':'400px',
            'padding':'15px',
            'z-index':10000,
            'background':'#fff', //
            'box-shadow':'0 1px 1px rgba(0, 0, 0, 0.15)'
        });
        var overlay  = $('<div id="gw-overlay"/>').css({
            'position':'fixed',
            'top':'0',
            'left':'0',
            'width':'0px',
            'height':'0px',
            'padding':'0',
            'display':'none',
            'z-index':9999,
            'background':'rgba(0, 0, 0, 0.35)', //
        }).addClass('gw-hide-overlay');
        $("body").append(block);
        $("body").append(overlay);

        var title = $('<div><b></b></div>');
        var htmlCode = $('<small><pre style="height: 300px;overflow-y: scroll;display: block;"><code class="language-markup"></code></small>');


        var cancelButton = $('<button class="gw-btn gw-btn-cancel" style="display:none;">&#10060; Cancel</button>');
        var prevButton = $('<button class="gw-btn" style="display:none;">&uarr; up</button>');
        var startButton = $('<span style="display:none;" class="gw-hide"><input type="text" class="gw-form-control" id="gw-widget-name" value="tempWidget"/> <select id="gw-widget-type"><option value="widget" defaults>Widget</option><option value="setting" defaults>Setting</option><option value="view" defaults>View</option></select> <button class="gw-btn">Start &#10004;</button></span>');
        title.append(prevButton);
        title.append(startButton);
        title.append(cancelButton);

        block.append(title);
        block.append(htmlCode);
        prevButton.on('click',function(event){
            event.stopPropagation();
            target = selectedTarget = $(target).parent()[0];
            showCode();
        })
        cancelButton.on('click',function(event){
            event.stopPropagation();
            selectedTarget = null;
            unexpandModal();
        })
        startButton.on('click','button',function(event){
            var htmlText = htmlCode.text();
            var type = $("#gw-widget-type").val();
            if(type=="setting"){
                var selectedText = window.getSelection().toString();
                if(selectedText==""){
                    alert('Выберите текст для настройки!');
                    return;
                }else{
                    htmlText = selectedText;
                }
            }
            global.TemplateActions.loadTemplates({
                "name":$("#gw-widget-name").val(),
                "type":type,
                "editable":true,
                "html":htmlText
            });
            // var xhr = new XMLHttpRequest();
            // xhr.open("POST", "http://localhost:1025/post/widget", true);
            // xhr.onreadystatechange = function() {


            //   if (xhr.readyState == 4) {
            //     // JSON.parse does not evaluate the attacker's scripts.
            //     var resp = JSON.parse(xhr.statusText);
            //     var alertBlock = $('<div class="gw-alert"></div>');
            //     title.append(alertBlock);

            //     if(resp.error==0){
            //         alertBlock.addClass('gw-alert-success');
            //     }else{
            //         alertBlock.addClass('gw-alert-danger');
            //     }
            //     alertBlock.text(resp.message);
            //   }
            // }
            // xhr.send(JSON.stringify({
            //     "name":$("#gw-widget-name").val(),
            //     "type":type,
            //     "html":htmlText
            // }));
        })
		// ----------------------------------------------------------
		// This part of the script triggers when page is done loading
		console.log("Hello. This message was sent from scripts/inject.js");
		// ----------------------------------------------------------

        var target = null;
        $('body *').on('mouseover',function(e){
            if(localStorage["greenwave_active"]=="false") return true;
            if(selectedTarget!==null) {
                return;
            }
            $('.gw-outline').removeClass('gw-outline');
            target = e.target;
            $(target).addClass('gw-outline');
        });

        $('body').on('mousemove',function(e){
            if(localStorage["greenwave_active"]=="false") return true;
            if(target===null || selectedTarget!==null) return;
            title.children('b').text(target.tagName);
            block.css({
                top:e.clientY+10,
                left:e.clientX+10
            });
            showCode();
        }).on('click',function(e){
            if(localStorage["greenwave_active"]=="false") return true;
            // console.log($(target).html(),"WAT!?");
            e.preventDefault();
            selectedTarget = target;
            expandModal();
        });

        $(document).keydown(function(e) {
            console.log(e);
            switch(e.which) {
                case 69: // left
                if(e.shiftKey && e.ctrlKey){
                    localStorage["greenwave_active"] = localStorage["greenwave_active"]=="false"?"true":"false";
                    console.log(localStorage.greenwave_active);
                    if(localStorage["greenwave_active"]=="false"){
                        $('.gw-outline').removeClass('gw-outline');
                        $('#gw-block,#gw-overlay').hide();
                    }
                }else{
                    return true;
                }
                break;

                case 38: // up
                break;

                case 39: // right
                break;

                case 40: // down
                break;

                default: return; // exit this handler for other keys
            }
            e.preventDefault(); // prevent the default action (scroll / move caret)
        });


        function showCode(){
            var markup = htmlCode.find('.language-markup');
            markup.text(target.outerHTML.replace(' class="gw-outline"','').replace(' gw-outline','').replace('class=""',''));
            // Prism.highlightElement(markup[0]);
        }
        function unexpandModal(){
            overlay.hide();
            block.find('.gw-btn, .gw-hide').hide();
            $('.gw-alert').clear();
        }
        function expandModal(){
            var w = $(window);
            var width = w.innerWidth();

            overlay.css({
                height:w.innerHeight(),
                width:width,
            }).show();
            var left = (width/2-300);
            block.animate({
                top:'200px',
                left:left,
                width:'600px',
                heigth:'400px'
            });
            block.find('.gw-btn, .gw-hide').show();
        }

    }
    }, 10);
// });