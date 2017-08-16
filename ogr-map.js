//PART 1
function render_chr(){
    var Height = 250; //the height of svg
    var rx = 8, ry = 8; //the radius of rect
    var d_color = "#27B927", w_color = "#8AD88A", Chr_width = 15;
    var chr_svg_w = document.getElementById("container").offsetWidth -20;//the width of the svg
    var unit = chr_svg_w/10; //interval distance
    //Part 1.1
    //render Chromosomes

    var chr_svg = d3.select("body").select(".chr-map").append("svg").attr("width",chr_svg_w + "px").attr("height",Height+"px");
    var chromosomes = chr_svg.selectAll("rect")
                            .data(data)
                            .enter()
                            .append("rect")
                            .attr("rx",rx).attr("ry",ry)
                            .attr("width",Chr_width + "px").attr("cursor","pointer").attr("fill-opacity",.8)
                            .attr("id",function(d){return d.name;})
                            .attr("x",function(d){return d.ogr * unit + "px";})
                            .attr("y",function(d){return Height - d.len*.5 - 20 + "px";})
                            .attr("fill",function(d){if(d.name.match(/^D[0-9]*$/)){return d_color;}else{return w_color;}})
                            .attr("height",function(d){return d.len * .5 + "px";})
                            .on("mouseover",function(d,i){d3.select(this).attr("fill-opacity",1);})
                            .on("mouseout",function(d,i){d3.select(this).attr("fill-opacity",.8);})
                            .on("click",function(d){ChrDetails(d);});
    //render Text
    chr_svg.selectAll("text")
        .data(data)
        .enter()
        .append("text")
        .text(function(d){return d.name.replace(/[A-Za-z]/,"Chr");})
        .attr("x",function(d,i){
                    if(i%2==0){
                        return d.ogr * unit - 15 + "px";
                    }else{
                        return d.ogr * unit + 0 +"px";
                    }
        })
        .attr("y",Height+"px")
    
    //render Marks
    function Mark(m_color,m_y,m_text){
        var mark_dom = chr_svg.append("rect");
        mark_dom.attr("x",function(){return chr_svg_w * .8 + "px";})
                .attr("y",m_y + "px")
                .attr("width","80px")
                .attr("fill",m_color)
                .attr("height",Chr_width + "px")
        var text_dom = chr_svg.append("text")
                            .text(m_text)
                            .attr("x",function(){return chr_svg_w * .9 + "px";})
                            .attr("y", m_y + Chr_width + "px");
    }
    
    Mark(d_color,20,"Cultivated");
    Mark(w_color,40,"Wild");
}
             
function ChrDetails(d){
    var chr_name;
    chr_name = d.name.replace(/D/,"Cultivated Chr ");
    chr_name = chr_name.replace(/W/,"Wild Chr ");
    
    var chr_details = d3.select("body").select(".chr-details");
    chr_details.attr("class","chr-details col-md-12");  //set the box attr
    
    chr_details.select("#"+d.name.replace(/[WD]/,'chr')).remove();   //remove existed panel
    
    chr_details.select(".panel-info").attr("class","panel panel-warning");
    var chr_panel = chr_details.insert("div",".panel-warning").attr("class","panel panel-info").attr("id",d.name.replace(/[WD]/,'chr'));    
    chr_panel.style("width","50px").style("margin-left","50%")
                .transition()
                .ease("sin-out")
                .duration(500)
                    .style("width","100%").style("margin-left","0%");

    
    chr_panel.append("div").attr("class","panel-heading").text("Statistics: "+chr_name);
    var chr_panel_body = chr_panel.append("div").attr("class","panel-body").append("div").attr("class","row");
    
    var jbrowse_url = "./JBrowse/index.html?data=cucumber&loc=Chr"+d.name.replace(/[WD]/,'')+"&tracks=DNA%2CmRNA%2Cmyvcf&highlight=";
    chr_panel_body.html(
                "<div class='col-md-4'><p><strong>Chromosome:</strong> Cultivated chr "+d.name.replace(/[WD]/,' ')+"</p>"+
                "<p><strong>Length: </strong>  "+d.d_l+"</a></p>"+
                "<p><strong>Gene Number: </strong> "+d.d_gene+"</p></div>"+
        
                "<div class='col-md-4'><p><strong>Chromosome:</strong> Wild chr "+d.name.replace(/[WD]/,' ')+"</p>"+
                "<p><strong>Length: </strong>"+d.w_l+"</p>"+
                "<p><strong>Gene Number: </strong>"+ d.w_gene+"</p></div>"+
                "<div class='col-md-4 text-right'><p><a><button class='btn btn-default' onclick=render_pro("+d.name.replace(/[WD]/,'')+")>&nbsp;&nbsp;Included proOGRs&nbsp; &nbsp;&nbsp;<span class='glyphicon glyphicon-hand-down' aria-hidden='true'></span></button></a></p><p><a href='"+jbrowse_url+"' target='_blank'><button class='btn btn-default' title='Only cultivated cucumber chromosomes have been visualized with JBrowse.'>Show this in JBrowse <span class='glyphicon glyphicon-new-window' aria-hidden='true'></span></button></a></p></div>"+
                "<h6 class='text-right'><small>* Only cultivated cucumber chromosomes have been visualized with JBrowse.</small></h6>"
                       );
    
    chr_details.select("#panel_close").remove();
    chr_details.append("p").attr("class","text-right").append("button")
            .attr("class","btn btn-info")
            .attr("id","panel_close")
            .text("Close the box")
            .on("click",function(){
                            chr_details.selectAll("*").remove();
                            chr_details.attr("class","chr-details col-md-12 hidden");
            });
    
    $('body,html').animate({scrollTop:$('#chr').offset().top},500);//scroll animation
}
                
render_chr();

//PART 2
function render_pro(c){            //***     "c" means chromosome, it is numberic   ***
    svg_area = ".pro-map";
    svg_detail_area = ".pro-details";
    
    var dom_data='', wil_data='';
    d3.select("body").select(".pro").attr("class","pro row"); 
    var _height = document.getElementById("pro-map").offsetWidth * .9;//the width of the svg
    var _radius = _height/2, _innerRadius = _radius * .9;    //define the radius
    var _startAngle, _endAngle, _class;
    _startAngle = Math.PI ; 
    _endAngle = Math.PI * 2;
    
    var dnaCanvas = d3.select("body").select(".pro-map");
    dnaCanvas.selectAll("*").remove();
    
    dnaCanvas.append("p").html("Chr "+ c +"&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Cultivated :  Wild&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;");
    
    dnaCanvas.select("p").append("a")
        .attr("class","btn btn-info").attr("target","_blank").attr("href","./full_screen?chr="+ c)
        .html("<span class = 'glyphicon glyphicon-fullscreen'></span>&nbsp;&nbsp;Full Screen View");
  
    json_path = './data/proOGR/proOGR_'+ c +'_dom.json';
    Domestic(json_path);
    
    function Domestic(json_path){              
        d3.json(json_path,function(error,dom_data){            
            _class = "domestic";
            var domestic = pieChart(svg_area)
                    .radius(_radius)
                    .innerRadius(_innerRadius)
                    .data(dom_data);
            
            domestic.render(); 
            json_path = './data/proOGR/proOGR_'+ c +'_wil.json';
            
            Wild(json_path); //render wild after domestic
            
                        /* after the render of wild*/
            $('body,html').animate({scrollTop:$('#pro').offset().top},1000);//scroll animation
        });
    }// include render wild: Wild(c);
               
    
//Render wild chromosome
    
    function Wild(json_path){
        d3.json(json_path,function(error,wil_data){
        
            _class = "wild";
            var wild = pieChart(svg_area)
                    .radius(_radius)
                    .innerRadius(_innerRadius)
                    .data(wil_data);
            wild.render();
            d3.select(".pro-map").select(".wild").style({"transform":"scaleX(-1)","margin-left":"10px"});
      });
    }           

    function pieChart(svg_area) {
        var _chart = {};
        var _width = _height/2, _data = [], _svg, _bodyG, _pieG, _radius, _innerRadius;
        var _color = d3.scale.category20();
        _chart.render = function () {
                            if (!_svg) {
                                _svg = d3.select(svg_area).append("svg")
                                        .attr("height", _height)
                                        .attr("width", _width)
                                        .attr("class",_class);
                            }

            renderBody(_svg);
        };

        function renderBody(svg) {
            if (!_bodyG)
                _bodyG = svg.append("g")
                        .attr("class", "body");
                renderPie();
        }

        function renderPie() {
            var pie = d3.layout.pie() // Sort by id
                    .sort(function (d) {
                        return d.id;
                    })
                    .value(function (d) {
                        return d.len;
                    })
                    .startAngle(_startAngle)
                    .endAngle(_endAngle);//define the size of pie

            var arc = d3.svg.arc()
                    .outerRadius(_radius)
                    .innerRadius(_innerRadius);

            if (!_pieG)
                _pieG = _bodyG.append("g")
                        .attr("class", "pie")
                        .attr("transform", "translate(" 
                                    + _radius 
                                    + "," 
                                    + _radius + ")");

            renderSlices(pie, arc ,svg_detail_area);

//            renderLabels(pie, arc); //set for labels
        }

        function renderSlices(pie, arc, svg_detail_area) {
            var slices = _pieG.selectAll("path.arc")
                            .data(pie(_data)); //d =>pie(_data)

            slices.enter()
                .append("path")
                .attr("class", function (d){
                        return "arc" + d.data.ogr;
                })
                .attr("stroke","darkgrey")
                .attr("cursor",function(d){
                    if(d.data.ogr) return "pointer";
                    return "pointer";
                })
                .attr("fill", function (d, i) {
                    if(! d.data.ogr){ return "darkgrey";}
                    else {return _color(d.data.ogr); } //define the color of each segment
                })
                .attr("fill-opacity",function(d){
                    if(! d.data.ogr) { return 1;}
                    else {return .5;}
                })
                .on("mouseover",function(d){    //mouseover and mouseout
                    //if(d.data.ogr){
                        var hover_class = ".arc" + d.data.ogr;
                        d3.select(".pro").selectAll(hover_class).attr("fill-opacity",1);
                        d3.select("body").select(svg_detail_area).attr("class","pro-details col-md-5 col-md-offset-1");
                        pro_ogrInformation(d.data,c);
                    //}
                })
                .on("mouseout",function(d){
                    if(d.data.ogr){
                        var hover_class = ".arc" + d.data.ogr;
                        d3.select(".pro").selectAll(hover_class).attr("fill-opacity",.5);
                    }
                })
                .on("click",function (d){
                                d3.select("body").select(svg_detail_area).select(".dropme")
                                    .attr("class","saved");
                            });
                    
                    
            slices.transition().duration(1500)
                .attrTween("d", function (d) {
                                    var currentArc = this.__current__; // <-C

                                    if (!currentArc)
                                        currentArc = {startAngle: 0, 
                                                        endAngle: 0};

                                    var interpolate = d3.interpolate(currentArc, d);
                                            
                                    this.__current__ = interpolate(1);//<-D
                        
                                    return function (t) {
                                        return arc(interpolate(t));
                                    };
                                });
        }

    //information of ogr
        function pro_ogrInformation(pc,c){
            d3.select("body").select(".pro-details").selectAll(".dropme").remove();
            var ogrinfo = d3.select("body").select(".pro-details").append("div").attr("class","dropme");
            
            if(! pc.ogr){ 
                ogrinfo.append("p").html("No ortholog information available at this rigion in chromosome "+ c);
            }
            else{
				ogrinfo.append("p").html("Chromosome: "+c+"<br/>proOGR: <a href=\"search?proogr="+pc.ogr+"\" target=\"_blank\">"+pc.ogr+"</a><br/>Start: "+pc.start+"<br/>End: "+pc.end+"<br/>Gene number: "+ pc.gene_num+"<br/><a href=\"./search?chr="+c+"&start="+pc.start+"&end="+pc.end+"\" target=\"_blank\">Search gene in this region</a>");
                if(window.location.href.match(/full_screen/)){
                    btn_url = './JBrowse/index.html?data=cucumber&loc=Chr'+c+'%3A'+pc.start+'..'+pc.end+'&tracks=DNA%2Cgene&highlight='; 
                }
                else{ 
                    btn_url = "#jbrowse";
                    ogrinfo.append("a").append("button").attr("class","btn btn-default")
                        .html("&nbsp;&nbsp;Included dnaOGRs&nbsp; &nbsp;&nbsp;<span class='glyphicon glyphicon-hand-down' aria-hidden='true'></span>")
                        .on("click",function(){render_dna(pc.ogr,c);});//pc.ogr is the proOGR mid
                }
                ogrinfo.append("a").attr("href",btn_url).append("button").attr("class","btn btn-default")
                    .html("Show this is JBrowse  <span class='glyphicon glyphicon-new-window' aria-hidden='true'></span>")
                    .on("click",function(){              
                        JBrowse(pc.start,pc.end,c); //turn to PART 3      
                    });
                ogrinfo.append("p");
            }
            
             ogr_detail = d3.select("body").select(".pro-details"); 
             ogr_detail.select("#panel_close").remove();
             ogr_detail.append("p").attr("class","text-right").append("button")
                .attr("class","btn btn-info")
                .attr("id","panel_close")
                .text("Close the box")
                .on("click",function(){
                            ogr_detail.selectAll("*").remove();
                            ogr_detail.attr("class","pro-details col-md-5 hidden");
                })
        }
                
        function renderLabels(pie, arc) {
            var labels = _pieG.selectAll("text.label")
                            .data(pie(_data)); // <-E

            labels.enter()
                .append("text")
                .attr("class", "label");

            labels.transition()
                .attr("transform", function (d) {
                                        return "translate(" + arc.centroid(d) + ")"; // <-F
                    })
                .attr("dy", ".35em")
                .attr("text-anchor", "middle")
                .text(function (d) {
                            return d.data.id;
                });
        }

        _chart.width = function (w) {if (!arguments.length) return _width; _width = w; return _chart;};

        _chart.height = function (h) {if (!arguments.length) return _height;_height = h;return _chart;};

        _chart.colors = function (c) {if (!arguments.length) return _colors;_colors = c;return _chart;};

        _chart.radius = function (r) {if (!arguments.length) return _radius;_radius = r;return _chart;};

        _chart.innerRadius = function (r) {if (!arguments.length) return _innerRadius;_innerRadius = r;return _chart;};

        _chart.data = function (d) {if (!arguments.length) return _data;_data = d;return _chart;};

    return _chart;
    }
}


// PART 3    ===> IN this part, the input json file should be the same as the one in part2
function render_dna(c,chr){            //***     "c" means ogr(proOGR mid), it is numberic   ***
    svg_area = ".dna-map";
    svg_detail_area = ".dna-details";
    
    var dom_data='', wil_data='';
    d3.select("body").select(".dna").attr("class","dna row"); 
    var _height = document.getElementById("dna-map").offsetWidth * .9;//the width of the svg
    var _radius = _height/2, _innerRadius = _radius * .9;    //define the radius
    var _startAngle, _endAngle, _class;
    _startAngle = Math.PI ; 
    _endAngle = Math.PI * 2;
    
    var dnaCanvas = d3.select("body").select(".dna-map");
    dnaCanvas.selectAll("*").remove();
       
    function Domestic(json_path){              
        d3.json(json_path,function(error,dom_data){            
            _class = "domestic";
            var domestic = pieChart(svg_area)
                    .radius(_radius)
                    .innerRadius(_innerRadius)
                    .data(dom_data);
            
            domestic.render(); 
            $pwd_url = window.location.host;
            json_path = 'http://'+$pwd_url+'/CGC/dnaOGR_json?promid='+c+'&dw=d';                                        //<=====  This need to change
            
            Wild(json_path); //render wild after domestic
                                    /* after the render of wild*/
            $('body,html').animate({scrollTop:$('#dna').offset().top},1000);//scroll animation
        });
    }// include render wild: Wild(c);
               
dnaCanvas.append("p").html("Chr "+chr+", proOGR "+ c +"&nbsp;&nbsp;Cultivated :  Wild&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;");
    
    dnaCanvas.select("p").append("a")
        .attr("class","btn btn-info").attr("target","_blank").attr("href","./full_screen?chr="+ chr+"&pro="+c)//chr:chromosme   c:proOGR
        .html("<span class = 'glyphicon glyphicon-fullscreen'></span>&nbsp;&nbsp;Full Screen View");

    $pwd_url = window.location.host;
    //alert($pwd_url);
    json_path = 'http://'+$pwd_url+'/CGC/dnaOGR_json?promid='+c+'&dw=d';                                              //<=====  This need to change
    Domestic(json_path);
    
//Render wild chromosome
    
    function Wild(json_path){
        d3.json(json_path,function(error,wil_data){     
            _class = "wild";
            var wild = pieChart(svg_area)
                    .radius(_radius)
                    .innerRadius(_innerRadius)
                    .data(wil_data);
            wild.render();
            d3.select(".dna-map").select(".wild").style({"transform":"scaleX(-1)","margin-left":"10px"});
      });
    }           

    function pieChart(svg_area) {
        var _chart = {};
        var _width = _height/2, _data = [], _svg, _bodyG, _pieG, _radius, _innerRadius;
  //      var _color = d3.scale.category20();
        var _color = d3.scale.category20c();
        _chart.render = function () {
                            if (!_svg) {
                                _svg = d3.select(svg_area).append("svg")
                                        .attr("height", _height)
                                        .attr("width", _width)
                                        .attr("class",_class);
                            }

            renderBody(_svg);
        };

        function renderBody(svg) {
            if (!_bodyG)
                _bodyG = svg.append("g")
                        .attr("class", "body");
                renderPie();
        }

        function renderPie() {
            var pie = d3.layout.pie() // Sort by id
                    .sort(function (d) {
                        return d.id;
                    })
                    .value(function (d) {
                        return d.len;
                    })
                    .startAngle(_startAngle)
                    .endAngle(_endAngle);//define the size of pie

            var arc = d3.svg.arc()
                    .outerRadius(_radius)
                    .innerRadius(_innerRadius);

            if (!_pieG)
                _pieG = _bodyG.append("g")
                        .attr("class", "pie")
                        .attr("transform", "translate(" 
                                    + _radius 
                                    + "," 
                                    + _radius + ")");

            renderSlices(pie, arc ,svg_detail_area);

//            renderLabels(pie, arc); //set for labels
        }

        function renderSlices(pie, arc, svg_detail_area) {
            var slices = _pieG.selectAll("path.arc")
                            .data(pie(_data)); //d =>pie(_data)

            slices.enter()
                .append("path")
                .attr("class", function (d){
                        return "arc" + d.data.ogr;
                })
                .attr("stroke","darkgrey")
                .attr("cursor",function(d){
                    if(d.data.ogr) return "pointer";
                    return "pointer";
                })
                .attr("fill", function (d, i) {
                    if(! d.data.ogr){ return "darkgrey";}
                    else {return _color(d.data.ogr); } //define the color of each segment
                })
                .attr("fill-opacity",function(d){
                    if(! d.data.ogr) { return 1;}
                    else {return .5;}
                })
                .on("mouseover",function(d){    //mouseover and mouseout
                        var hover_class = ".arc" + d.data.ogr;
                        d3.select(".dna").selectAll(hover_class).attr("fill-opacity",1);
                        d3.select("body").select(svg_detail_area).attr("class","dna-details col-md-5 col-md-offset-1");
                        dna_ogrInformation(d.data,c);
                })
                .on("mouseout",function(d){
                    if(d.data.ogr){
                        var hover_class = ".arc" + d.data.ogr;
                        d3.select(".dna").selectAll(hover_class).attr("fill-opacity",.5);
                    }
                })
                .on("click",function (d){
                                d3.select("body").select(svg_detail_area).select(".dropme")
                                    .attr("class","saved");
                            });
                    
                    
            slices.transition().ease("cubic").duration(1500)
                .attrTween("d", function (d) {
                                    var currentArc = this.__current__; // <-C

                                    if (!currentArc)
                                        currentArc = {startAngle: 0, 
                                                        endAngle: 0};

                                    var interpolate = d3.interpolate(currentArc, d);
                                            
                                    this.__current__ = interpolate(1);//<-D
                        
                                    return function (t) {
                                        return arc(interpolate(t));
                                    };
                                });
        }

    //information of ogr
        function dna_ogrInformation(pc,c){
            d3.select("body").select(".dna-details").selectAll(".dropme").remove();
            var ogrinfo = d3.select("body").select(".dna-details").append("div").attr("class","dropme");
            
            if(! pc.ogr){ 
                ogrinfo.append("p").html("No ortholog information available at this rigion in chromosome "+ c);
            }
            else{
				ogrinfo.append("p").html("Chromosome: "+chr+"<br/>"+"dnaOGR: <a href=\"search?dnaogr="+pc.ogr+"\" target=\"_blank\">"+pc.ogr+"</a><br/>Start: "+pc.start+"<br/>End: "+pc.end+"<br/><a href=\"./search?chr="+chr+"&start="+pc.start+"&end="+pc.end+"\" target=\"_blank\">Search genes in this region</a>");
                if(window.location.href.match(/full_screen/)){
                    btn_url = './JBrowse/index.html?data=cucumber&loc=Chr'+c+'%3A'+pc.start+'..'+pc.end+'&tracks=DNA%2Cgene&highlight='; 
                }
                else{ 
                    //btn_url = "#jbrowse";
                    btn_url = "###";// stay put
                }
                
                ogrinfo.append("a").attr("href",btn_url).append("button").attr("class","btn btn-default")
                    .html("Show this is JBrowse  <span class='glyphicon glyphicon-new-window' aria-hidden='true'></span>")
                    .on("click",function(){              
                        JBrowse(pc.start,pc.end,chr); //turn to PART 3      
                    });
            }
                        
             ogr_detail = d3.select("body").select(".dna-details"); 
             ogr_detail.select("#panel_close").remove();
             ogr_detail.append("p").attr("class","text-right").append("button")
                .attr("class","btn btn-info")
                .attr("id","panel_close")
                .text("Close the box")
                .on("click",function(){
                            ogr_detail.selectAll("*").remove();
                            ogr_detail.attr("class","dna-details col-md-5 hidden");
                })
        }
                
        function renderLabels(pie, arc) {
            var labels = _pieG.selectAll("text.label")
                            .data(pie(_data)); // <-E

            labels.enter()
                .append("text")
                .attr("class", "label");

            labels.transition()
                .attr("transform", function (d) {
                                        return "translate(" + arc.centroid(d) + ")"; // <-F
                    })
                .attr("dy", ".35em")
                .attr("text-anchor", "middle")
                .text(function (d) {
                            return d.data.id;
                });
        }

        _chart.width = function (w) {if (!arguments.length) return _width; _width = w; return _chart;};

        _chart.height = function (h) {if (!arguments.length) return _height;_height = h;return _chart;};

        _chart.colors = function (c) {if (!arguments.length) return _colors;_colors = c;return _chart;};

        _chart.radius = function (r) {if (!arguments.length) return _radius;_radius = r;return _chart;};

        _chart.innerRadius = function (r) {if (!arguments.length) return _innerRadius;_innerRadius = r;return _chart;};

        _chart.data = function (d) {if (!arguments.length) return _data;_data = d;return _chart;};

    return _chart;
    }

}

//PART 4
function JBrowse(s,e,c){//s: start; e: end ; c: chr
    var jbrowse_area = d3.select("body").select(".jbrowse");
    var jbrowse_map = jbrowse_area.attr("class","jbrowse row").select(".jbrowse-map");
    var jb_url = './JBrowse/index.html?data=cucumber&loc=Chr'+c+'%3A'+s+'..'+e+'&tracks=DNA%2Cgene&highlight=';
                    
    jbrowse_map.selectAll("p,h4").remove();
    jbrowse_map.select("iframe").remove();
                    
    jbrowse_map.append("p")
            .append("a")
                .attr("class","btn btn-success")
                .attr("target","_blank")
                .attr("href",jb_url)
                .html("<span class = 'glyphicon glyphicon-fullscreen'></span>&nbsp;&nbsp;Full Screen View");
    jbrowse_map.append("h4").text("Cultivated reference chromosome: " + c );
    var jb_width = $(".jbrowse-map").width();
    jbrowse_map.append("iframe").attr("class","jbrowse").attr("src",jb_url).attr("height","500px").attr("width",jb_width).attr("style","border: 1px #E7E7E7 solid");
    // After the jbrowse was open
    $('body,html').animate({scrollTop:$('#jbrowse').offset().top-50},1000);//scroll animation
}
