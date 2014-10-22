/*
 * Package: ChartBubble
 * Version: 1.00 (2012-04-06)
 * Author:  hitsubunnu(wbi)
 */

function ChartBubble(options) {
	this.title	 = options['title'];
	this.id		 = options['id'];
	this.width	 = options['width'] || 1000;
	this.height	 = options['height'] || 400;
	
	this.lb		 = options['label_bottom'];
	this.ll		 = options['label_left'];
	this.data	 = options['data'];

	this.ratio	 = options['ratio'] || 0.618;
	this.digit   = options['digit'] || 2;
	this.zoom	 = options['zoom'] || this.width/1000;
	this.radius  = options['radius']  || 1;

}

ChartBubble.prototype.draw = function() {
	var W = this.width;
	var H = this.height;	
	var R = this.ratio;
	var w = R * W;
	var h = R * H;
	var x0 = (1-R)/2*W;
	var y0 = (1-R)/2*H;
	var rleft = this.ll;
	var rbottom = this.lb;
	var paper = Raphael(this.id,W,H);
	var zoom  = paper.rect(x0,y0,w,h).attr({fill: "",stroke: '',opacity: 0.5});
	var object = this;
	
	object.draw_background(paper,rleft,rbottom);
	object.draw_graphics(paper,rleft,rbottom);


	var mx_s,my_s,mx_e,my_e;
	zoom.mousedown(function(ev){
		mx_s = ev.pageX || ev.clientX + document.documentElement.scrollLeft - document.body.clientLeft;
		my_s = ev.pageY || ev.clientY + document.documentElement.scrollTop - document.body.clientTop;
	}).mouseup(function(ev){
		mx_e = ev.pageX || ev.clientX + document.documentElement.scrollLeft - document.body.clientLeft;
		my_e = ev.pageY || ev.clientY + document.documentElement.scrollTop - document.body.clientTop;
		
		var mx_width = mx_e - mx_s;
		var my_height = my_e - my_s;		

		rleft.max = rleft.max*my_height/h;
		rleft.min = rleft.min*my_height/h;
		
		rbottom.max = rbottom.max*mx_width/w;
		rbottom.min = rbottom.min*mx_width/w;

		console.log( rleft )

		paper.clear();
		object.draw_background(paper,rleft,rbottom);
		object.draw_graphics(paper,rleft,rbottom);
	});
}

ChartBubble.prototype.draw_graphics = function(paper,rleft,rbottom) {
	var W = this.width;
	var H = this.height;
	var R = this.ratio;
	var Z = this.zoom;
	var data = this.data;
	var title = this.title;
	var radius = this.radius;
	var ll = rleft || this.ll;
	var lb = rbottom || this.lb;
	var w = R * W;
	var h = R * H;
	var x0 = (1-R)/2*W;
	var y0 = (1-R)/2*H;
	var height = ll.max  - ll.min;
	var width  = lb.max  - lb.min;
	
	// graphics
	for(var i=0;i<data.length;i++){
		var line = data[i];

		(function(){
			var x      = line.x;
			var y      = line.y;
			
			if(x < lb.min || x > lb.max){ return }
			if(y < ll.min || y > ll.max){ return }

			var value  = line.value;
			var string = line.string;
			var color  = line.color;
			var cx 	   = x0 + (x - lb.min)/width * w;
			var cy     = y0 + (ll.max - y)/height * h; 
			var r	   = value * radius;
			var scolor = Raphael.hsb(0, 1, .25);

			console.log(  ) 

			var show;
			paper.circle(cx, cy, r).attr(
				{fill: "r#FFF-"+color, stroke: '' }
			).mouseover(function(){
				show = paper.set(
					paper.rect(cx+20*Z,cy-25*Z,120*Z,50*Z,5*Z).attr({fill: color,stroke:"#FFF",'stroke-width':2}),
					paper.text(cx+80*Z,cy,string + ":" + value).attr({'font-size': 12*Z,'fill':"#FFF",'font-weight':'bold'})
				);
			}).mouseout(function(){
				show.remove();
			});
		})();
	}
	
}

ChartBubble.prototype.draw_background = function(paper,rleft,rbottom) {
	var W = this.width;
	var H = this.height;
	var R = this.ratio;
	var Z = this.zoom;
	var F = Math.pow(10,this.digit);
	var data = this.data;
	var title = this.title;
	var ll = rleft || this.ll;
	var lb = rbottom || this.lb;
	var w = R * W;
	var h = R * H;
	var x0 = (1-R)/2*W;
	var y0 = (1-R)/2*H;
	
	// label top (title)
	paper.text(W/2,y0/2,title.string).attr({fill: 'brown','font-size': 18*Z,'font-weight':'bold'}).attr(title.option);

	// label left
	for(var i=0;i<=ll.cali;i++){
		var y   = y0 + h * (ll.cali - i) / ll.cali;
		var txt = ll.min+(ll.max-ll.min)/ll.cali*i;
		txt = Math.round( txt * F ) / F;
		paper.text(x0/2,y,txt).attr({'font-size': 16*Z});
	}

	// label right
	var lr_x = (x0+w)*1.01;
	var lr_y = y0;
	for(var i=0;i<data.length;i++){
		if(!data[i].color){
			data[i].color = Raphael.getColor();
			this.data[i].color = data[i].color;
		}
		paper.rect(lr_x,lr_y,12*Z,12*Z).attr({fill: data[i].color,stroke: ''});
		paper.text(lr_x+16*Z,lr_y+6*Z,data[i].string).attr({fill: data[i].color,'font-size': 14*Z,'text-anchor':"start",'font-weight':'bold'});
		lr_y += 16*Z;
	}
	
	// label bottom
	var lb_y = 1.5*y0+h;
	for(var i= 0;i<=lb.cali;i++){
		var x = x0 + w * i / lb.cali;
		var txt = lb.min+(lb.max-lb.min)/lb.cali*i;
		txt = Math.round( txt * F ) / F;
		paper.text(x,lb_y,txt).attr({'font-size': 12*Z});
	}

	// backdrop
	for(var i=0;i<=ll.cali;i++){
		var x = x0 + w;
		var y = y0 + h * i / ll.cali;

		paper.path("M "+x0+" "+y+" "+"L "+x+" "+y).attr("stroke","#ccc").toBack(); 
	}
	
	for(var i=0;i<=lb.cali;i++){
		var x = x0 + w * i / lb.cali;
		var y = y0 + h;
		
		paper.path("M "+x+" "+y0+" "+"L "+x+" "+y).attr("stroke","#ccc").toBack(); 
	}
}
