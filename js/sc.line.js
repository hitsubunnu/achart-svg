/*
 * Package: ChartLine
 * Version: 1.00 (2012-04-06)
 * Author:  hitsubunnu(wbi)
 */

function ChartLine(options) {
	this.title	 = options['title'];
	this.id		 = options['id'];
	this.width	 = options['width'] || 1000;
	this.height	 = options['height'] || 400;
	
	this.max	 = options['label_left_max'];
	this.min	 = options['label_left_min'];
	this.l_x 	 = options['label_bottom'];
	this.data	 = options['data'];
	
	this.ratio	 = options['ratio'] || 0.618;
	this.digit   = options['digit'] || 6;
	this.zoom	 = options['zoom'] || this.width/1000;

}

ChartLine.prototype.draw = function() {
	var W = this.width;
	var H = this.height;
	var R = this.ratio;
	var Z = this.zoom;
	var max = this.max;
	var min = this.min;
	var data = this.data;
	var l_x  = this.l_x;
	var title = this.title;
	var F = Math.pow(10,this.digit);
	var w = R * W;
	var h = R * H;
	var x0 = (1-R)/2*W;
	var y0 = (1-R)/2*H;
	var height = max - min;
	var cali = w/(l_x.length)/2;

	var paper = Raphael(this.id,W,H);

	// label top (title)
	paper.text(W/2,y0/2,title.string).attr({fill: 'brown','font-size': 18*Z,'font-weight':'bold'}).attr(title.option);

	// label left
	var ll_y = new Array(max,(max-height/4*1),(max-height/4*2),(max-height/4*3),min);
	for(var i=0;i<=4;i++){
		var y   = y0 + h * i / 4;
		var txt = Math.round( ll_y[i] * F ) / F;
		paper.text(x0/2,y,txt).attr({'font-size': 16*Z});
	}

	// label right
	var lr_x = (x0+w)*1.01;
	var lr_y = y0;
	for(var i=0;i<data.length;i++){
		if(!data[i].color){
			data[i].color = Raphael.getColor();
		}
		paper.rect(lr_x,lr_y,12*Z,12*Z).attr({fill: data[i].color,stroke: ''});
		paper.text(lr_x+16*Z,lr_y+6*Z,data[i].string).attr({fill: data[i].color,'font-size': 14*Z,'text-anchor':"start",'font-weight':'bold'});
		lr_y += 16*Z;
	}
	
	// label bottom
	var lb_len = l_x.length;
	var lb_y = 1.5*y0+h;
	paper.text(x0+cali,lb_y,l_x[0]).attr({'font-size': 12*Z});
	paper.text(x0+w+cali,lb_y,l_x[lb_len-1]).attr({'font-size': 12*Z});
	
	var lb_cali = Math.round( lb_len / 4 );
	for(var i= lb_cali;i<lb_len;i=i+lb_cali){
		var x = x0 + w / lb_len * i + cali;
		paper.text(x,lb_y,l_x[i]).attr({'font-size': 12*Z});
	}

	// grahics
	for(var i=0;i<data.length;i++){
		var line = data[i];

		(function(){
			var values = line.values;
			var color  = line.color;
			var string = line.string;
			var x = x0 + cali;
			var y = y0 + (max-values[0])/height * h; 
	
			var path = "M "+x+" "+y+" ";
			for(var j=0;j<values.length;j++){
				x = x0 + w / values.length * j + cali;
				y = y0 + (max-values[j])/height * h ; 
				path += "L "+x+" "+y+" ";
				
				(function(){
					var cx = x;
					var cy = y;
					var value = values[j]	
					var date  = l_x[j];	
					paper.circle(cx, cy, 4*Z).attr({fill: "#FFF",'fill-opacity': 0,stroke: ''});
				
					var show;
					paper.circle(cx, cy, 4*Z).attr(
						{fill: "#FFF",'fill-opacity': 0,stroke: ''}
					).mouseover(function(){
						show = paper.set(
							paper.circle(cx,cy,4*Z).attr({fill: color,stroke:''}).toBack(),
							paper.rect(cx+20*Z,cy-25*Z,120*Z,50*Z,5*Z).attr({fill: color,stroke:"#FFF",'stroke-width':2}),
							paper.text(cx+80*Z,cy,date+'\n'+ string + ":" + value).attr({'font-size': 12*Z,'fill':"#FFF",'font-weight':'bold'})
						);
					}).mouseout(function(){
			    		show.remove();
					});
				})();
	
			}
			paper.path( path ).attr({"stroke": color,"stroke-width":2}).toBack();
		})();
	}
	
	// backdrop
	for(var i=0;i<=4;i++){
		var x = x0 + w;
		var y = y0 + h * i / 4;
		
		paper.path("M "+x0+" "+y+" "+"L "+x+" "+y).attr("stroke","#ccc").toBack(); 
	}
}
