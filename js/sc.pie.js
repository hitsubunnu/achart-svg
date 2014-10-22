/*
 * Package: ChartPie
 * Version: 0.02 (2012-03-16)
 * Author:  hitsubunnu
 */

function ChartPie(options) {
	this.title	 = options['title'];
	this.id		 = options['id'];
	this.width	 = options['width'] || 400;
	this.height	 = options['height'] || 400;
	
	this.data	 = options['data'];
	
	this.ratio	 = options['ratio'] || 0.618;
	this.fl 	 = options['fl'] || 6;
	this.zoom	 = options['zoom'] || 1;

}

ChartPie.prototype.draw = function() {
	var W = this.width;
	var H = this.height;
	var R = this.ratio;
	var Z = this.zoom;
	var w = R * W;
	var h = R * H;
	var x0 = W/2;
	var y0 = H/2;

	var paper = Raphael(this.id,W,H);

	// label top (title)
	var title = this.title;
	paper.text(W/2,(H-h)/4,title.string).attr(title.option);

	// label right
	var lr_x= ((W-w)/2+w)*0.9;
	var lr_y = (H-h)/4;
	for(var i=0;i<this.data.length;i++){
		paper.rect(lr_x,lr_y,12*Z,12*Z).attr({fill: this.data[i].color,stroke:"white"});
		paper.text(lr_x+15*Z,lr_y+6*Z,this.data[i].string+' '+this.data[i].value*100+'%').attr({fill: this.data[i].color,'font-size': 14*Z,'text-anchor':"start"});
		lr_y += 16*Z;
	}
	
	// label bottom
	
	// grahics
	var r = h/2*Z, 
		x_flag = x0+ r,
		y_flag = y0,
		angle_flag = 0;
 
	for(var i=0;i<this.data.length;i++){
		var value = this.data[i].value;
		var color = this.data[i].color;
		var string = this.data[i].string;
		angle_flag += value*360; 

		(function(){
			
			var rad = angle_flag*Math.PI/180;
			var	xs = x_flag;
			var	ys = y_flag;
			var	xe = x0 + r * Math.cos(rad);
	        var ye = y0 + r * Math.sin(rad);
			x_flag = xe;
			y_flag = ye;
			var v = value;
			var c = color;
			var s = string;
			var	angle = value*360;
			var elattrs = [{transform: "s1.1 1.1 " + x0 + " " + y0},{transform: ""}]; 
			var change = 1;

			var show;
			paper.path(
				["M", x0, y0,"L",xs,ys,"A", r, r,rad ,+( (angle > 180) ? 1 : 0 ), 1, xe,ye,"z"]
			).attr(
				{fill: c,stroke:"white"}
			).click(function(){
				this.animate(elattrs[+(change = !change)],1000,'bounce');
			}).mouseover(function(ev){
				this.mousemove(function(ev){
					if(show) show.remove();
					var x = ev.pageX || ev.clientX + document.documentElement.scrollLeft - document.body.clientLeft;
					var y = ev.pageY || ev.clientY + document.documentElement.scrollTop - document.body.clientTop;
	
					show = paper.set(
						paper.rect(x-60*Z,y-15*Z,120*Z,30*Z,5*Z).attr({fill:c,stroke:"white",'stroke-width':2}),
						paper.text(x,y,s+':'+ v*100+'%').attr({'font-size': 15*Z,'fill':"white",'font-weight':'bold'})
					);
				});
			}).mouseout(function(){
	    		show.remove();
			});
		
		})();
	
	}
}
