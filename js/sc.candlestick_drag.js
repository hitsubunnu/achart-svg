/*
 * Package: ChartCandlestick
 * Version: 0.02 (2012-03-16)
 * Author:  hitsubunnu
 */

function ChartCandlestick(options) {
	this.title	 = options['title'];
	this.id		 = options['id'];
	this.width	 = options['width'] || 400;
	this.height	 = options['height'] || 400;
	
	this.max	 = options['label_left_max'];
	this.min	 = options['label_left_min'];
	this.l_x 	 = options['label_bottom'];
	this.data	 = options['data'];
	this.average = options['average'];
	this.volume  = options['volume'];

	this.ratio	 = options['ratio'] || 0.618;
	this.fl   = options['fl'] || 6;
	this.zoom	 = options['zoom'] || this.width/1000;

	/* debug 
	this.width = 400;
	this.height = 400;
	this.zoom = 400/1000;
	/*/

}

ChartCandlestick.prototype.draw = function() {
	var W = this.width;
	var H = this.height;
	var R = this.ratio;
	var Z = this.zoom;
	var F = Math.pow(10,this.fl);
	var w = R * W;
	var h = R * H * 0.8;
	var h_v = R * H * 0.2;
	var x0 = (1-R)/2*W;
	var y0 = (1-R)/2*H;
	var height = this.max - this.min;
	var datas = this.data;
	var averages = this.average;
	var volumes = this.volume;

	var paper = this.draw_graphics(datas,averages,volumes);

	var pdrag = Raphael("show_drag",W,100);
	//console.log( pdrag )	
	// drag
	var memo = pdrag.text(50,10,"debug").attr({fill:"red"});
	var left = pdrag.image('img/slider.gif',x0,0,10,60);
	var right = pdrag.image('img/slider.gif',x0+w,0,10,60);
	var t = this;
	var len = datas.length;
	left.drag(
			function(dx,dy){
				memo.attr({text: "moving"});
				var mv = this.ox+dx;
				if (mv < x0) mv = x0;
				if (mv > right.attr("x")) mv = right.attr("x")-w/len;
				left.attr({x:mv});
			},function(){
				memo.attr({text: "start"});
		        this.ox = this.attr("x")
				this.attr({src: "img/slider_hover.gif"})
			},function(){
				this.attr({src: "img/slider.gif"})
				paper.remove()
				var s = Math.round( ( left.attr("x") - x0 )/w*len );
				var e = Math.round( ( right.attr("x") - x0 )/w*len );
				memo.attr({text: "左:"+s+","+"右:"+e});
			   	//console.log( left.attr("x") + "  " + x0 + "  " + w + "  "+sl);	
				paper = t.draw_graphics(datas.slice(s,e),averages,volumes.slice(s,e))	
			}
	);

	right.drag(
			function(dx,dy){
				memo.attr({text: "moving"});
				var mv = this.ox+dx;
				if (mv > x0+w) mv = w+x0;
				if (mv < left.attr("x")) mv = left.attr("x")+w/len;
				right.attr({x:mv});
			},function(){
				memo.attr({text: "start"});
		        this.ox = this.attr("x")
				this.attr({src: "img/slider_hover.gif"})
			},function(){
				this.attr({src: "img/slider.gif"})
				paper.remove()
				var s = Math.round( ( left.attr("x") - x0 )/w*len );
				var e = Math.round( ( right.attr("x") - x0 )/w*len );
				memo.attr({text: "左:"+s+","+"右:"+e});
			   	//console.log( left.attr("x") + "  " + x0 + "  " + w + "  "+sl);	
				paper = t.draw_graphics(datas.slice(s,e),averages,volumes.slice(s,e))	
			}
	);
	// graphics in drag 
	var h_drag = 60;
	var values = averages[0]['values'];	
	var cali = w / values.length;
	var x = x0 + cali/2 + 5;
	var y = (this.max-values[0])/height * h_drag; 
	
	var path = "M "+x+" "+y+" ";
	for(var j=0;j<values.length;j++){
		x = x0 + w / values.length * j + cali/2 + 5;
		y = (this.max-values[j])/height *  h_drag; 
		path += "L "+x+" "+y+" ";
	}
	pdrag.path( path ).attr({"stroke":"#70a9e0","stroke-width":2}).toBack();

	pdrag.rect(x0+5,0,w,h_drag).attr({fill: "",stroke: "#ccc"}).toBack();
	//pdrag.text(x0+w/2,30,"この部分のグラフは最後に追加する").attr({fill: "red",stroke: ""});


}


ChartCandlestick.prototype.draw_graphics = function( datas,averages,volumes ) {
	var W = this.width;
	var H = this.height;
	var R = this.ratio;
	var Z = this.zoom;
	var F = Math.pow(10,this.fl);
	var w = R * W;
	var h = R * H * 0.8;
	var h_v = R * H * 0.2;
	var x0 = (1-R)/2*W;
	var y0 = (1-R)/2*H;
	var height = this.max - this.min;

	var paper = Raphael(this.id,W,H);
	
	// label top (title)
	var title = this.title;
	paper.text(W/2,y0/2,title.string).attr(title.option);

	// label left
	var l_y = new Array(this.max,(this.min+height/4*1),(this.min+height/4*2),(this.min+height/4*3),this.min);
	for(var i=0;i<=4;i++){
		var y   = y0 + h * i / 4;
		var txt = Math.round( l_y[i] * F ) / F;
		paper.text(x0/2,y,txt).attr({'font-size': 16*Z});
	}

	// label right
	var lr_x=(x0+w)*1.01;
	var lr_y = y0;
	for(var i=0;i<this.average.length;i++){
		paper.rect(lr_x,lr_y,12*Z,12*Z).attr({fill: this.average[i].color});
		paper.text(lr_x+44*Z,lr_y+6*Z,this.average[i].string).attr({fill: this.average[i].color,'font-size': 14*Z});
		lr_y += 16*Z;
	}

	// label bottom
	var lb_len = this.l_x.length;
	var lb_y = 1.5 * y0 + h + h_v;
	if(lb_len > 1){
		for(var i= 0;i<lb_len;i++){
			var x = x0 + w / (lb_len-1) * i; 
			paper.text(x,lb_y,this.l_x[i]).attr({'font-size': 12*Z});
		}
	}
		
	//var show_data = function(datas) {	
		// graphics : data 
		var record = new Array;
		var data_len = datas.length;
		var cali = w / data_len;
		for(var i=0;i<data_len;i++){
			var open  = datas[i][1],
				high  = datas[i][2],
				low   = datas[i][3],
				close = datas[i][4];
			
			var x = x0 + cali/2+cali*i;
			var high_y  = y0 + (this.max - high)/height*h;
			var low_y   = y0 + (this.max - low )/height*h;
			var open_y  = y0 + (this.max - open)/height*h;
			var close_y = y0 + (this.max - close)/height*h;
	        var rect_h,rect_c,rect_y,rect_x=x-cali*0.4;
			if( open_y > close_y ){
				rect_c = "red";
				rect_h = open_y - close_y;
				rect_y = close_y;
			}else{
				rect_c = "green";
				rect_h = close_y - open_y;
				rect_y = open_y;
			}
			
			paper.path("M "+ x + " " + high_y + "L " + x + " " + low_y).attr({stroke: 'black'});
			var candle = paper.rect(rect_x,rect_y,cali*0.8,rect_h).attr({fill: rect_c,stroke: 'black'});
			record[i] = { x: rect_x, y: rect_y ,data: datas[i],average:[]};
			for(var j=0;j<averages.length;j++){
				record[i].average.push([averages[j].string,averages[j].values[i]]); 
			}
			if(volumes){
				record[i].volume = volumes[i];
			}
			candle.node.raphaelid = i ;
		
			var show;
			candle.node.onmouseover = function(){
				var point = record[ this.raphaelid ];
				var memo = "日付: " + point.data[0] + "\n" + "始値: " + point.data[1] + "\n" + "高値: " + point.data[2] + "\n" + "安値: " + point.data[3] + "\n" + "終値: " + point.data[4] + "\n"
				for (var i=0;i<point.average.length;i++) {
					memo += point.average[i][0] + ": " + point.average[i][1] + "\n";
				}
				if(point.volume){
					memo += "出来高: " + point.volume + "\n";
				}
				   
				show = paper.set(
					paper.rect(point.x+20*Z,point.y-60*Z,120*Z,120*Z,5*Z).attr({fill: "#FFF"}),
					paper.text(point.x+80*Z,point.y,memo).attr({'font-size': 12*Z})
				);
			}
		    candle.node.onmouseout = function(){
	    		show.remove();
			}
		}
		

		// graphics : average
		for(var i=0;i<averages.length;i++){
			var values = averages[i]['values'];	
			var x = x0 + cali/2;
			var y = y0 + (this.max-values[0])/height * h; 
	
			var path = "M "+x+" "+y+" ";
			for(var j=0;j<values.length;j++){
				x = x0 + w / values.length * j + cali/2;
				y = y0 + (this.max-values[j])/height * h ; 
				path += "L "+x+" "+y+" ";
			}
			paper.path( path ).attr({"stroke":averages[i]['color'],"stroke-width":2,"stroke-dasharray":"-"}).toBack();
		}
		
		// graphic : volume
		if(volumes){
			var vmax = Math.max.apply( null,volumes ); 
			var vmin = Math.min.apply( null,volumes );
			var v_len = vmax - vmin;
	
			for(var i=0;i<volumes.length;i++){
				var x = x0 + cali * 0.1 + cali*i;
				var y = y0 + h*1.05 + (vmax - volumes[i])/v_len*h_v;
			   	var vrect = paper.rect(x,y,cali*0.8,(volumes[i]-vmin)/v_len*h_v).attr({fill: "#3166cc",stroke: ''});
				vrect.node.raphaelid = 'v' + i;
	
				var show;
				vrect.node.onmouseover = function(){
					var point = record[ this.raphaelid.replace(/v(.*?)/,"$1") ];
					var memo = "日付: " + point.data[0] + "\n" + "始値: " + point.data[1] + "\n" + "高値: " + point.data[2] + "\n" + "安値: " + point.data[3] + "\n" + "終値: " + point.data[4] + "\n"
					for (var ii=0;ii<point.average.length;ii++) {
						memo += point.average[ii][0] + ": " + point.average[ii][1] + "\n";
					}
					if(point.volume){
						memo += "出来高: " + point.volume + "\n";
					}
					   
					show = paper.set(
						paper.rect(point.x+20*Z,y0 + h + h_v-60*Z,120*Z,120*Z,5*Z).attr({fill: "#FFF"}),
						paper.text(point.x+80*Z,y0 + h + h_v,memo).attr({'font-size': 12*Z})
					);
				}
			    vrect.node.onmouseout = function(){
		    		show.remove();
				}
			}	
			paper.rect(x0,y0+h*1.05,w,h_v).attr({fill: "",stroke: "#ccc"}).toBack();
		
		}
	
	// backdrop
	for(var i=0;i<=4;i++){
		var x = x0 + w;
		var y = y0 + h * i / 4;
		
		paper.path("M "+x0+" "+y+" "+"L "+x+" "+y).attr("stroke","#ccc").toBack(); 
	}
		
	return paper;
}
