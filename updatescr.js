
var rateusd=1;
function chart(type,day,code,brand,company,name,param){
     
	
	if(param==null){
    	param={ran:new Date().getTime(),range:$('#irange').val(),code:code,rate:'0',gold:'0',bank:$('#bank').val(),date:$('#date').val(),brand:brand,company:company,name:name};
   	 	param[type]='1';
   	 	if($('#chart_tab li.active a[aria-controls=chart_'+type+']').length==0)
   	        $('#chart_tab a[aria-controls=chart_'+type+']').click();
	}
        var  ph    =document.getElementById('chart_'+type);
         if(ph==null){
             $("#gbhistory").empty();
             $("#gbhistory").append("<tr><td colspan=3  class='text-center' ><img src='/rate/loading.gif' /></td></tr>");
        	 $("#ghistory").modal("show");
        	 data_gold=null;
        	 data_rate=null;
         }
         
    $('#chart_tab a[aria-controls=chart_'+type+'] .chart_name').text((param.name==null?param.code:param.name).replace(/Vàng/gi,'')); 
		$.get('/json.php',param,function(a,b){
			var v=a[type+'s'];
			var l=v.length;
			var kq=null;
			var xchart=[];
			var dat=[];
			for(var i=0;i<l;i++){
            r=v[i].value;
           
           
             for(var h=0;h<r.length;h++){
               var buy = parseFloat(r[h]['buy'].replace(/[^0-9\.]/g,''));
               if(buy==0 && r[h]['transfer'])buy = parseFloat(r[h]['transfer'].replace(/[^0-9\.]/g,''));
               var sell=parseFloat(r[h]['sell'].replace(/[^0-9\.]/g,''));
                    dat[dat.length]=[
                               (type=='rate')?new Date(parseFloat(v[i].updated)):new Date(v[i].updated.replace(/-/g,"/")),
                            	buy,
                                null,
                                null,
                                sell,
                                null,
                                null
                    ];
        
            }
			}

			  var data=new google.visualization.DataTable();// google.visualization.arrayToDataTable(dat);

			  data.addColumn('date','Ngày');
			  data.addColumn('number','Mua');
			  data.addColumn({type: 'string', role: 'annotation'});
			  data.addColumn({type: 'string', role: 'style'});
			  data.addColumn('number',  'Bán');
			  data.addColumn({type: 'string', role: 'annotation'});
			  data.addColumn({'type': 'string', 'role': 'style'});
              data.addRows(dat);

			  
			  var title=(param.name==null?param.code:param.name);

              
         var options = {
        		 pointSize:1,
	            vAxis: {
	            	 gridlines: {
	               	    count: Math.min(15,Math.max(4,$('#chart_gold').innerHeight()/40))
	               	  }},
	     		hAxis: {
	     		      showTextEvery : 1,
	       	        //  slantedTextAngle : 45,
	       	          slantedText: true,
	       	          format: 'dd/MM/yy',
     				  gridlines: {
     			  	    count: Math.min(30,Math.max(12,$('#chart_gold').innerWidth()/80))
     			  	  }
	     	    },
			          //curveType: 'function',
			        legend: { position: 'right' }
			};
         if(type=='rate'){
				option_rate=options;
				data_rate=data;
				data_rate1=dat;
				param_rate=param;
			}
			else{
				option_gold=options;
				if(data_gold){
					data.setColumnLabel(1, data_gold.getColumnLabel(1));
					data.setColumnLabel(4, data_gold.getColumnLabel(4));
				}
				data_gold=data;
				 
				data_gold1=dat;
				param_gold=param;
			}

       
        
        
         var  ph    =document.getElementById('chart_'+type);
         if(ph){
     		redraw();
         }else{
            ghistory()
         }
         
        
        
        

		});
		
		$('#chart_'+type).empty();
		$('#chart_'+type).append('<img src="/rate/loading.gif" />');

	
		
		return type=='gold' && false;
	}
	
function ghistory(){
	$("#ghistory").modal("show");
	$("#gbhistory").empty();
    var data=(($('#chart_gold.active').length>0  || data_rate==null)?data_gold:data_rate);
	var len=data.getNumberOfRows();
    var pv1=0;
    var pv2=0;
    var pv0;
    var min1=-1;
    var max1=-1;
    var min2=-1;
    var max2=-1;
    
    var data1=[];
    for(var i=0;i<len;i++){
          if( (i>0 && i!=len-1  )  && 
	    	  (Math.abs(data.getValue(i,1)-pv1)<(0.2/(len<100?10:1)) || Math.abs(data.getValue(i,1)-pv1)/pv1<(0.002/(len<100?10:1))) && 
	    	  (Math.abs(data.getValue(i,4)-pv2)<(0.2/(len<100?10:1)) || Math.abs(data.getValue(i,4)-pv2)/pv2<(0.002/(len<100?10:1))) && 
	    	  (data.getValue(i,0)!=null &&   pv0!=null  && data.getValue(i,0).format('dd/mm/yy') == pv0.format('dd/mm/yy')) &&
          (i+1>=len || data.getValue(i+1,0)==null || data.getValue(i,0)==null || data.getValue(i+1,0).format('dd/mm/yy') == data.getValue(i,0).format('dd/mm/yy'))
	    	  ){
			continue;
	         }  
	      
	       
        pv1=data.getValue(i,1);
        pv2=data.getValue(i,4);
        pv0=data.getValue(i,0);
        
    	data1[data1.length]=[data.getValue(i,0),data.getValue(i,1),data.getValue(i,4)];
    	
    	if(data.getValue(i,1)>0){
           max1=Math.max(data.getValue(i,1),max1);
           if(min1==-1)min1=max1;
           min1=Math.min(min1,data.getValue(i,1));
    	}
    	if(data.getValue(i,4)>0){
            max2=Math.max(data.getValue(i,4),max2);
            if(min2==-1)min2=max2;
            min2=Math.min(min2,data.getValue(i,4));
     	}
    }

    
    data1.sort(function(a, b){return a[0].getTime()-b[0].getTime()});
    data=data1;

    len=data.length;
    var ww=$(window).width();
	for(var i=0;i<len;i++){
        var td1="";
        var td2="";
        var pc1="";
        var pc2="";
        var claz1='glyphicon glyphicon-stop';
        var claz2=claz1;
        var  color1='black';
        var  color2='black';
		if(i>0){
           td1=data[i][1]-pv1;
           td2=data[i][2]-pv2;
           pc1=parseInt(td1*10000/pv1)/100.0;
           pc2=parseInt(td2*10000/pv2)/100.0;
           if(td1>0){
        	   color1='green';
               claz1='glyphicon glyphicon-arrow-up';
           }else if(td1<0){
               claz1='glyphicon glyphicon-arrow-down';
               color1='red';
           }
           if(td2>0){
        	   color2='green';
               claz2='glyphicon glyphicon-arrow-up';
           }else  if(td2<0){
               claz2='glyphicon glyphicon-arrow-down';
               color2='red';
           }
           td1=Math.abs(td1);
           td2=Math.abs(td2);
           pc1=Math.abs(pc1);
           pc2=Math.abs(pc2);
           td1=$.number(td1,2,'.',',');
           td2=$.number(td2,2,'.',',');
           pc1=$.number(pc1,2,'.',',');
           pc2=$.number(pc2,2,'.',',');
		}
		pv1=data[i][1];
		pv2=data[i][2];
		var td=(today==data[i][0].format('yyyymmdd'));
		
		
		//round
		if(ww<350){
			if(td1>=50)td1=Math.ceil(td1);
			else if(td1>=10)td1=Math.ceil(td1*10)/10.0;
			if(td2>=50)td2=Math.ceil(td2);
			else if(td2>=10)td2=Math.ceil(td1*20)/10.0;
			
			if(pc1>=25)pc1=Math.ceil(pc1);
			else if(pc1>=5)pc1=Math.ceil(pc1*10)/10.0;
			if(pc2>=25)pc2=Math.ceil(pc2);
			else if(pc2>=5)pc2=Math.ceil(pc2*10)/10.0;
		}
		if(td1!=null)td1=td1.toString().replace('.00','');
		if(td2!=null)td2=td2.toString().replace('.00','');
		if(pc1!=null)pc1=pc1.toString().replace('.00','');
		if(pc2!=null)pc2=pc2.toString().replace('.00','');
		
		$("#gbhistory").prepend(
				"<tr style='"+(td?"font-weight: bold;":"")+";padding:2px 0'>"+  
				"<td >"+((today==data[i][0].format('yyyymmdd') && data[i][0].format('HH:MM')!="00:00")?data[i][0].format('dd/mm HH:MM'):data[i][0].format(data[i][0].getYear()==new Date().getYear()?'dd/mm':'dd/mm/yy'))+"</td>"+
				"<td ><div class='col-xs-6' style='color:"+color1+(min1==pv1?"; background: #ffaaaa;":(max1==pv1?"; background: #aaffaa;":""))+"'>"+($.number(pv1,2,'.',',')).replace('.00','')+"</div><div class='col-xs-6' style='color:"+color1+";padding: 0'><div style='"+(ww<360?"display:none":"")+"' class='"+claz1+" small  col-xs-6 text-center'>"+pc1+((i>0)?"%":"")+"</div><div class='"+claz1+" small  col-xs-"+(ww<360?"12":"6")+" text-right'>"+td1+"</div></div></td>"+
				"<td ><div class='col-xs-6' style='color:"+color2+(min2==pv2?"; background: #ffaaaa;":(max2==pv2?"; background: #aaffaa;":""))+"'>"+($.number(pv2,2,'.',',')).replace('.00','')+"</div><div class='col-xs-6' style='color:"+color2+";padding: 0'><div style='"+(ww<360?"display:none":"")+"' class='"+claz2+" small  col-xs-6 text-center'>"+pc2+((i>0)?"%":"")+"</div><div class='"+claz2+" small  col-xs-"+(ww<360?"12":"6")+" text-right'>"+td2+"</div></div></td>"+
				"</tr>"
		);
	}
	$("#gbhistory").append(
			"<tr>"+ 
			"<td colspan=3 style='font-size:80%;' class='text-right' ><a target='_blank' href='//www.tygia.com'>Cung cấp bởi TYGIA.COM</a></td>"+
			"</tr>"
	);
}
var data_rate0=null;
var data_gold0=null;
var data_rate=null;
var data_gold=null;
var option_rate=null;
var option_gold=null;
var param_gold=null;
var param_rate=null;
var ret=0;
var rate=0;
google.load('visualization', '1.1', {packages: ['corechart', 'line']});

