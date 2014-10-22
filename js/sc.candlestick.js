/*
 * Package: ChartCandlestick
 * Version: 0.02 (2012-03-16)
 * Author:  hitsubunnu
 */

function ChartCandlestick(options) {
	this.id		 = options['id'];
	this.width	 = options['width'] || 1000;
	this.height	 = options['height'] || 500;
	
	this.title	 = options['title'];
	this.fx	 	 = options['fx'];
	this.ll		 = options['label_left'];
	this.lb 	 = options['label_bottom'];
	this.data	 = options['data'];
	this.average = options['average'];
	this.volume  = options['volume'];

	this.ratio	 = options['ratio'] || 0.618;
	this.digit   = options['digit'] || 3;
	this.zoom	 = options['zoom'] || this.width/1000;
}

ChartCandlestick.prototype.draw = function() {
	var W = this.width;
	var H = this.height;
	var R = this.ratio;
	var Z = this.zoom;
	var ll = this.ll;
	var lb = this.lb;
	var title = this.title;
	var fx = this.fx;
	var average = this.average;
	var volume = this.volume;
	var data = this.data;
	var digit = this.digit;
	var w = R * W;
	var h = R * H * 0.8;
	var h_v = R * H * 0.2;
	var x0 = (1-R)/2*W;
	var y0 = (1-R)/2*H;
	ll.max = Number(ll.max);
	ll.min = Number(ll.min);
	var height = ll.max - ll.min;
	var hh = y0+h*1.05; 
	if(!volume){
	   	h_v = 0;
		hh = y0+h;
	}

	var paper = Raphael(this.id,W,H);
	// init
	var fonts = {'font-weight':'bold','font-family':"'MS Gothic','sans-serif'"};
	if(!average[0].color) average[0].color = "#0099c5";
	if(!average[1].color) average[1].color = "#ff9900";

	// label top (title)
	paper.text(W/2,y0/2,title.string).attr(fonts).attr({fill: 'brown','font-size': 18*Z}).attr(title.option);
	// fx
	if(fx){
		paper.text(x0+w,y0*0.8,"取引通貨:"+fx).attr(fonts).attr({fill: '#ccc','font-size': 14*Z,'text-anchor':"end"});
	}

	// label left
	for(var i=0;i<=ll.cali;i++){
		var y   = y0 + h * (ll.cali - i) / ll.cali;
		var txt = (ll.min+(ll.max-ll.min)/ll.cali*i).toFixed(digit).replace(/^([+-]?\d+)(\d\d\d)/,"$1,$2");
		paper.text(x0*3/4,y,txt).attr({'font-size': 16*Z,'text-anchor':"end"});
	}

	// label right
	var lr_x=(x0+w)*1.01;
	var lr_y = y0;
	for(var i=0;i<average.length;i++){
		paper.rect(lr_x,lr_y,12*Z,12*Z).attr({fill: average[i].color,stroke: ''});
		paper.text(lr_x+16*Z,lr_y+6*Z,average[i].string).attr(fonts).attr({fill: average[i].color,'font-size': 14*Z,'text-anchor':"start"});
		lr_y += 16*Z;
	}


	// label bottom
	var lb_y = ( volume ) ? 1.5 * y0 + h + h_v : 1.5 * y0 + h ;
	if(lb.length > 1){
		for(var i= 0;i<lb.length;i++){
			var x = x0 + w / (lb.length-1) * i; 
			paper.text(x,lb_y,lb[i]).attr(fonts).attr({'font-size': 12*Z});
		}
	}
	
	// graphics : data 
	var cali = w / data.length;
	for(var i=0;i<data.length;i++){
		if(!data[i][0]) continue; 	
		(function(){
			var date  = data[i][0],
				open  = data[i][1],
				high  = data[i][2],
				low   = data[i][3],
				close = data[i][4];

			var x = x0 + cali/2+cali*i;
			var high_y  = y0 + (ll.max - high)/height*h;
			var low_y   = y0 + (ll.max - low )/height*h;
			var open_y  = y0 + (ll.max - open)/height*h;
			var close_y = y0 + (ll.max - close)/height*h;
			var rect_h,rect_c,rect_y,rect_x=x-cali*0.4;
			if( open_y > close_y ){
				rect_c = "#FFFFFF";
				rect_h = open_y - close_y;
				rect_y = close_y;
			}else{
				rect_c = "#3366CC";
				rect_h = close_y - open_y;
				rect_y = open_y;
			}
			
			if( open == '' || high =='' || low == '' || rect_h == 0 ){ 
				rect_c = "#000000";
				rect_h = 1; 
				rect_y = close_y;
			}
				
			var show;
			var	memo = "日付: " + date + "\n" + "始値: " + open + "\n" + "高値: " + high + "\n" + "安値: " + low + "\n" + "終値: " + close + "\n"
			for (var j=0;j<average.length;j++) {
				memo += average[j].string + ":" + average[j].values[i] + "\n";
			}
			if(volume){
				memo += "出来高:" + volume[i] + "\n";
			}
		
			paper.path("M "+ x + " " + high_y + "L " + x + " " + low_y).attr({stroke: '#3366CC'});
			paper.rect(rect_x,rect_y,cali*0.8,rect_h).attr( {fill: rect_c,stroke: '#3366CC'} )
			
			paper.rect(x0+cali*i,y0,cali,h*1.05+h_v).attr( 
					{fill: '#FFF','fill-opacity':0,stroke:''} 
			).mouseover( function(ev){
				show = paper.set(
					paper.path("M " + x + " " + y0 + "L " + x + " " + (y0+h) ).attr({fill:'#c00000',stroke:'#c00000'}).toBack(),
					paper.path("M " + x + " " + (hh) + "L " + x + " " + (hh+h_v) ).attr({stroke:'#c00000'}).toBack(),
					paper.rect(x-40*Z,hh+h_v,80*Z,20*Z).attr({fill: "#c00000",stroke:''}).toBack(),
					paper.text(x,hh+h_v+10*Z,date).attr(fonts).attr({fill:'#FFF','font-size': 12*Z}),
					paper.rect(x+20*Z,rect_y-60*Z,120*Z,120*Z,5*Z).attr({fill: "#d30000",stroke:'#FFF','fill-opacity':0.8}),
					paper.text(x+25*Z,rect_y,memo).attr(fonts).attr({fill:'#FFF','font-size': 12*Z,'text-anchor':"start"})
				);
			}).mouseout(function(){
				show.remove();
			})
			
		})();
	}
	
	// graphics : average
	for(var i=0;i<average.length;i++){
		var values = average[i]['values'];
		var path = '',
			x = '',
			y = '';

		for(var j=0;j<values.length;j++){
			if(!values[j]) continue; 	
			x = x0 + w / values.length * j + cali/2;
			y = y0 + (ll.max-values[j])/height * h ; 
			path += (path) ? "L "+x+" "+y+" " : "M "+x+" "+y+" ";
		}
		paper.path( path ).attr({"stroke":average[i]['color'],"stroke-width":1,'stroke-dasharray':'- '}).toBack();
	}
	
	// graphic : volume
	if(volume){
		var vmax = Math.max.apply( null,volume ); 
		var vmin = Math.min.apply( null,volume );
		var v_len = vmax - vmin;

		for(var i=0;i<volume.length;i++){
			(function(){
				var x = x0 + cali * 0.1 + cali*i;
				var y = y0 + h*1.05 + (vmax - volume[i])/v_len*h_v;
				var v = volume[i];
				paper.rect(x,y,cali*0.8,(volume[i]-vmin)/v_len*h_v).attr( {fill: "#3366CC",stroke: ''} ).toBack();
			})();
		}	
		
		// volume backdrop
		paper.rect(x0,hh,w,h_v).attr({fill: "",stroke: "#ccc"}).toBack();
		
		for(var i=1;i<=4;i++){
			var x = x0 + w;
			var y = y0 + h*1.05 + h_v * (4-i) / 4;

			paper.path("M "+x0+" "+y+" "+"L "+x+" "+y).attr({"stroke":"#ccc",'stroke-dasharray':'- '}).toBack();
			paper.text(lr_x,y,( vmax*i/4/1000 ).toFixed(digit).replace(/^([+-]?\d+)(\d\d\d)/,"$1,$2") ).attr({'text-anchor':"start"});	
		}
		paper.text(lr_x,(y0 + h*1.05 + h_v),"0 (千株)" ).attr({'text-anchor':"start"});	

		for(var i= 0;i<lb.length;i++){
			var x = x0 + w / (lb.length-1) * i; 
			paper.path("M "+x+" "+(hh)+" "+"L "+x+" "+(hh+h_v)).attr({"stroke":"#ccc",'stroke-dasharray':'- '}).toBack(); 
		}

	}
		
	// backdrop
	for(var i=0;i<=ll.cali;i++){
		var x = x0 + w;
		var y = y0 + h * i / ll.cali;

		paper.path("M "+x0+" "+y+" "+"L "+x+" "+y).attr({"stroke":"#ccc",'stroke-dasharray':'- '}).toBack(); 
	}
	
	if(lb.length > 1){
		for(var i= 0;i<lb.length;i++){
			var x = x0 + w / (lb.length-1) * i; 
			paper.path("M "+x+" "+y0+" "+"L "+x+" "+(y0+h)).attr({"stroke":"#ccc",'stroke-dasharray':'- '}).toBack(); 

		}
	}
}
