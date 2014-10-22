/*
 * Package: ChartRadar
 * Version: 1.00 (2012-04-06)
 * Author:  hitsubunnu(wbi)
 */

function ChartRadar(options) {
	this.title	 = options['title'];
	this.id		 = options['id'];
	this.width	 = options['width'] || 400;
	this.height	 = options['height'] || 400;
	
	this.data	 = options['data'];
	this.max	 = options['value_max'];

	this.ratio	 = options['ratio'] || 0.618;
	this.digit   = options['digit'] || 6;
	this.zoom	 = options['zoom'] || this.width/400;

}

ChartRadar.prototype.draw = function() {
	var W = this.width;
	var H = this.height;
	var R = this.ratio;
	var Z = this.zoom;
	var data = this.data;
	var title = this.title;
	var max = this.max;
	var w = R * W;
	var h = R * H;
	var r = w/2;
	var x0 = W/2;
	var y0 = H/2;
	var	rad = 2/data.length*Math.PI;
	var angle = 1.5*Math.PI;

	var paper = Raphael(this.id,W,H);

	// label top (title)
	paper.text(W/2,(H-h)/4,title.string).attr({fill: 'brown','font-size': 18*Z,'font-weight':'bold'}).attr(title.option);

	// memo
	for(var i=0;i<data.length;i++){
		var string = data[i].string
		var	x = Math.round(x0 + r * 1.1 * Math.cos(rad * i + angle));
		var y = y0 + r * 1.1 * Math.sin(rad * i + angle);
		
		var t_a = 'middle';
		if( x > x0) t_a = 'start';
		if( x < x0) t_a = 'end';
		
		paper.text(x,y,string).attr({'font-size': 12*Z,'fill':'#000000','font-weight':'bold','text-anchor':t_a})
	}

	// grahics
	var path = '';
	var cali = r / max
	for(var i=0;i<data.length;i++){
		var line = data[i];

		var	x = x0 + cali * line.value * Math.cos(rad * i + angle);
		var y = y0 + cali * line.value * Math.sin(rad * i + angle);
		
		path += (i == 0) ? "M "+x+" "+y+" " :"L "+x+" "+y+" " ;
		
		(function(){
			var cx = x;
			var cy = y;
			var value = line.value;
			var string = line.string;
				
			var show;
			paper.circle(cx, cy, 4*Z).attr(
				{fill: '#FECB00',stroke: ''}
			).mouseover(function(){
				show = paper.set(
					paper.rect(cx+20*Z,cy-25*Z,120*Z,50*Z,5*Z).attr({fill: '#FECB00',stroke:'#FFFFFF','stroke-width':2}),
					paper.text(cx+80*Z,cy,string + ':' + value).attr({'font-size': 12*Z,'fill':'brown','font-weight':'bold'})
				);
			}).mouseout(function(){
			   		show.remove();
			});
		})();
	}

	paper.path( path + "Z" ).attr({fill: "#FECB00", 'fill-opacity': 0.3,"stroke": "#FECB00","stroke-width":2}).toBack();

	// backdrop
	for(var i=0;i<data.length;i++){
		var	xe = x0 + r * Math.cos(rad * i + angle);
		var ye = y0 + r * Math.sin(rad * i + angle);
		
		paper.path("M " + x0 + " " + y0 + " " + "L " + xe + " " + ye).attr({stroke: '#CCCCCC'}).toBack();
	}

	for(var i=1;i<=max;i++){
		var cr = w/max/2*i
		var color = (max % 2) ?  ( ( i % 2) ? '#F2F2F2' : '#FFFFFF' ) : ( ( i % 2) ? '#FFFFFF' : '#F2F2F2' ) 
		paper.circle(x0,y0,cr).attr({fill:color,stroke:'#F2F2F2'}).toBack(); 
	}

}
