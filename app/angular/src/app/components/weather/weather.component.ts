import { Component, OnInit, AfterViewChecked } from '@angular/core';
import { RestService } from '../../services/rest.service';
import { HttpClient } from '@angular/common/http';
import * as $ from 'jquery';

@Component({
  selector: 'app-weather',
  templateUrl: './weather.component.html',
  styleUrls: ['./weather.component.css']
})
export class WeatherComponent implements OnInit, AfterViewChecked {
   constructor(private restService: RestService) { }

  ngOnInit() {
  }

  ngAfterViewChecked(): void {
    console.log("TEST");
    let canvas = (<HTMLCanvasElement>document.getElementById('zunanji'));     // html preišče pa da v canvas element
    canvas.width=300;
    canvas.height=450;
    let c = canvas.getContext('2d');
    let canvas2 = (<HTMLCanvasElement>document.getElementById('dez'));
    canvas2.width = 300;
    canvas2.height = 400;
    let ctx = canvas2.getContext('2d');
    let canvas3 = (<HTMLCanvasElement>document.getElementById('oblak'));     // border gre bek potem
    canvas3.width=300;
    canvas3.height=300;
    let cc = canvas3.getContext('2d');

    let enota="&units=metric";
    let jezik="&lang=sl";
    let save_mesto=$('#mesto').val();

    $('#slo').click(function(){
      jezik="&lang=sl";

    });
    $('#eng').click(function(){
      jezik="&lang=en";

    });
    $('#c').click(function(){
      enota="&units=metric";
      document.getElementById("za_oblak").style.backgroundColor = "white";
      document.getElementById("dez").style.backgroundColor = "white";
      cc.clearRect(0,0,300,300);
      ctx.clearRect(0,0,300,400);
      c.clearRect(0,0,300,450);
      const start_sneg=0;
      const start_dez=0;
      let m=$('#mesto').val();
      if (save_mesto!=''){
        $.ajax({
          url:'http://api.openweathermap.org/data/2.5/weather?q='+ save_mesto + enota +jezik +'&APPID=2d3b3578e57e8e82111274c7c14d62cc',
          type:"GET",
          dataType: "jsonp",
          success: function(data){
            console.log(data);
            show(data);
            $('#stopinje').html(data);
            $('#mesto').val('');
          }
        });
        $.ajax({
          url:'http://api.openweathermap.org/data/2.5/forecast?q='+save_mesto+
            '&mode=xml'+enota+jezik+'&APPID=2d3b3578e57e8e82111274c7c14d62cc',
          type:"GET",
          dataType: "jsonp",
          success: function(data){
            console.log(data);
            let wid2= show2(data);
            $('#mesto').val('');
          }
        });
      }
      else {
        $('#error').html('Ne sme biti prazno');
      }
    });
    $('#f').click(function(){
      enota="&units=imperial";
      document.getElementById("za_oblak").style.backgroundColor = "white";
      document.getElementById("dez").style.backgroundColor = "white";
      cc.clearRect(0,0,300,300);
      ctx.clearRect(0,0,300,400);
      c.clearRect(0,0,300,450);
      let start_sneg=0;
      let start_dez=0;
      let m=$('#mesto').val();
      if (save_mesto!=''){
        $.ajax({
          url:'http://api.openweathermap.org/data/2.5/weather?q='+ save_mesto +
            enota +jezik +'&APPID=2d3b3578e57e8e82111274c7c14d62cc',
          type:"GET",
          dataType: "jsonp",
          success: function(data){
            console.log(data);
            show(data);
            $('#fahrenheiti').html(data);
            $('#mesto').val('');
          }
        });
        $.ajax({
          url:'http://api.openweathermap.org/data/2.5/forecast?q='+
            save_mesto+'&mode=xml'+enota+jezik+'&APPID=2d3b3578e57e8e82111274c7c14d62cc',
          type:"GET",
          dataType: "jsonp",
          success: function(data){
            console.log(data);
            let wid2= show2(data);
            $('#mesto').val('');
          }
        });
      }
      else{
        $('#error').html('Ne sme biti prazno');
      }
    });
    $('#poslji').click(function(){
      document.getElementById("za_oblak").style.backgroundColor = "white";
      document.getElementById("dez").style.backgroundColor = "white";
      cc.clearRect(0,0,300,300);
      ctx.clearRect(0,0,300,400);
      c.clearRect(0,0,300,450);
      let start_sneg=0;
      let start_dez=0;
      let m=$('#mesto').val();
      if (m!=''){
        save_mesto=m;
        $.ajax({
          url:'http://api.openweathermap.org/data/2.5/weather?q='+ m +
            enota +jezik +'&APPID=2d3b3578e57e8e82111274c7c14d62cc',
          type:"GET",
          dataType: "jsonp",
          success: function(data){
            console.log(data);
            let wid= show(data);
            $('#stopinje').html(data);
            $('#mesto').val('');
          }
        });
        $.ajax({
          url:'http://api.openweathermap.org/data/2.5/forecast?q='+
          m+'&mode=xml'+enota+jezik+'&APPID=2d3b3578e57e8e82111274c7c14d62cc',
          type:"GET",
          dataType: "jsonp",
          success: function(data){
            console.log(data);
            let wid2= show2(data);
            // $('#show2').html(wid2);
            $('#mesto').val('');
          }
        });
      }
      else{
        $('#error').html('Ne sme biti prazno');
      }
    });

    /*Izpisa*/
    function show(data){
      let deznik=0;
      /*	Za animacije/oblak	*/
      if (data.weather[0].description.search("oblačno")!=-1 && data.weather[0].description=="pretežno oblačno"){
        cc.shadowBlur = 0; // alert("1");
        document.getElementById("zunanji").onmouseover = function() {svetli_oblak()};
      }
      else if (data.weather[0].description.search("oblačno")!=-1 && data.weather[0].description.search("jasno")!=-1){
        cc.shadowBlur = 0;			// alert("2");
        document.getElementById("zunanji").onmouseover = function() {temni_oblak()};
      }
      else if (data.weather[0].description.search("oblačno")!=-1 || data.weather[0].description.search("cloud")!=-1){
        cc.shadowBlur = 0;			// alert("2");
        document.getElementById("zunanji").onmouseover = function() {temni_oblak()};
      }
      else if (data.weather[0].description.search("sončno")!=-1 || data.weather[0].description.search("hot")!=-1){
        cc.shadowBlur = 0;			// alert("3");
        document.getElementById("zunanji").onmouseover = function() {sonce()};
      }
      else if (data.weather[0].description.search("dež")!=-1 && data.weather[0].description=="rahel dež" ||
                data.weather[0].description.search("rain")!=-1 && data.weather[0].description.search("light rain")!=-1){
        cc.shadowBlur = 0;
        deznik=1;			// alert("4");
        document.getElementById("zunanji").onmouseover = function() {rahel_oblak_dez()};
      }
      else if (data.weather[0].description.search("dež")!=-1 || data.weather[0].description.search("rain")!=-1){
        cc.shadowBlur = 0;
        deznik=1;			// alert("5");
        document.getElementById("zunanji").onmouseover = function() {oblak_dez()};
      }
      else if (data.weather[0].description.search("sne")!=-1 && data.weather[0].description=="rahlo sneženje" || data.weather[0].description.search("snow")!=-1 && data.weather[0].description=="light snow"){
        cc.shadowBlur = 0;			// alert("6");
        document.getElementById("zunanji").onmouseover = function() {oblak_zima()};
      }
      else if (data.weather[0].description.search("sne")!=-1 || data.weather[0].description.search("snow")!=-1){
        cc.shadowBlur = 0;			// alert("7");
        document.getElementById("zunanji").onmouseover = function() {m_oblak_zima()};
      }
      else if (data.weather[0].description.search("jasno")!=-1 || data.weather[0].description.search("clear")!=-1){
        cc.shadowBlur = 0;			// alert("8");
        document.getElementById("zunanji").onmouseover = function() {sonce()};
      }
      else{// alert("9");
        document.getElementById("zunanji").onmouseover = function() {};
      }
      /*	Za osebe  */
      let isci=enota.search("metric");
      if (isci>-1){
        let min=Math.round(data.main.temp_min);
        let max=Math.round(data.main.temp_max);
        let trenutno=Math.round(data.main.temp);
        let hitrost=Math.round(data.wind.speed*3.6);
        if ((trenutno<10 && deznik==1)|| (trenutno >=10 && trenutno <=20 && deznik==1)){
          jesen_deznik();
        }
        else if (trenutno >20 && deznik==1){
          pomlad_dez();
        }
        else if (trenutno<10){
          zima();
        }
        else if (trenutno>=10 && trenutno<=16){
          dez_jesen();
        }
        else if (trenutno >16 && trenutno <=20){
          pomlad();
        }
        else if (trenutno > 20 && trenutno<=34){
          poletje();
        }
        else if (trenutno >34){
          kopalke();
        }
        $('#opis').html(data.weather[0].description);
        $('#ime_mesta').html(data.name);
        $('#t_temp').html(trenutno + "°C");
        $('#min_temp').html(min + "°C");
        $('#max_temp').html(max + "°C");
        $('#vlaznost').html(data.main.humidity + "%");
        $('#veter').html(hitrost + " km/h");

      }
      else if (isci==-1){
        let min=Math.round(data.main.temp_min);
        let max=Math.round(data.main.temp_max);
        let trenutno=Math.round(data.main.temp);
        let hitrost=Math.round(data.wind.speed*3.6);
        if ((trenutno<50 && deznik==1)||(trenutno >=50 && trenutno <=68 && deznik==1)){
          jesen_deznik();
        }
        else if (trenutno >68 && deznik==1){
          pomlad_dez();
        }
        else if (trenutno<50){
          zima();
        }
        else if (trenutno>=50 && trenutno<=61){
          dez_jesen();
        }
        else if (trenutno >61 && trenutno <=68){
          pomlad();
        }
        else if (trenutno > 68 && trenutno<=93){
          poletje();
        }
        else if (trenutno >93){
          kopalke();
        }
        $('#opisf').html(data.weather[0].description);
        $('#ime_mestaf').html(data.name);
        $('#t_tempf').html(trenutno + "°F");
        $('#min_tempf').html(min + "°F");
        $('#max_tempf').html(max + "°F");
        $('#vlaznostf').html(data.main.humidity + "%");
        $('#veterf').html(hitrost + " mph");
      }
    }
    function show2(data){
      $('#druge_dni').html("Temperature v naslednjih štirih dneh:");
      let html='';
      let d = new Date();
        let n = d.getDate();
      let trenutni_dan=d.getDay();
      let j=1;
      let isci=enota.search("metric");
      let n_min_t=2000;
      let st_dan=1;
      let n_max_t=-2000;

      for (let i=0; i< data.list.length; i++){
        let min=Math.round(data.list[i].main.temp_min);
        let max=Math.round(data.list[i].main.temp_max);
        let trenutno=Math.round(data.list[i].main.temp);
        let mesec=data.list[i].dt_txt.slice(5,7);
        let leto=data.list[i].dt_txt.slice(0,4);
        let dan = data.list[i].dt_txt.slice(8,10);
        let datum=dan+'.'+mesec+'.'+leto;
        let ura=data.list[i].dt_txt.slice(10);
        if (n==dan){
            $('#danes').html("Temperature danes:");

            if (isci>-1){
              // $('#cas'+ j).html(ura);
              // $('#temp'+ j).html(trenutno+"°C");
              $('#'+j).html('<div class="col-lg-3 col-sm-3 col-xs-6"><span class="ura" id="cas1">'+
                ura+'</span><div class="liki" id="temp1">'+trenutno+'°C </div></div>')
              j++;
            }
            else if (isci==-1){
              // $('#cas'+ j).html(ura);
              // $('#temp'+ j).html(trenutno+"°F");
              // j++;
              $('#'+j).html('<div class="col-lg-3 col-sm-3 col-xs-6"><span class="ura" id="cas1">'+
                ura+'</span><div class="liki" id="temp1">'+trenutno+'°F </div></div>')

              j++
            }

          // html += '<p>Ob: ' + ura +'<b> Temp: ' + trenutno +'</b> °</p>'

        }
        else if (dan!=n){
          if (max>n_max_t){
              n_max_t=max;
          }
          if (min<n_min_t){
              n_min_t=min;
          }
          if(ura.search("21")!=-1){
            if (st_dan<=4){
              if (isci>-1){
                // $('#'+st_dan+'_max').html(n_max_t + '°C <hr class="horizontal"/>' + n_min_t + '°C');
                if (st_dan==1){
                  // $('#dynamic2').append('<div class="col-lg-3"><span class="dan">Jutri</span><div class="dnevi" 
                  // id="1_max">'+n_max_t+'°C<hr class="horizontal"/> '+n_min_t+'°C</div></div>');
                  $('#d'+st_dan).html('<div class="col-lg-3"><span class="dan">Jutri</span><div class="dnevi" id="1_max">'+
                    n_max_t+'°C<hr class="horizontal"/> '+n_min_t+'°C</div></div>');
                }
                else{
                  // $('#dynamic2').append('<div class="col-lg-3"><span class="dan">Čez '+st_dan+'
                  // dni</span><div class="dnevi" id="1_max">'+n_max_t+'°C<hr class="horizontal"/> '+n_min_t+'°C</div></div>');
                  $('#d'+st_dan).html('<div class="col-lg-3"><span class="dan">Čez '+
                    st_dan+' dni</span><div class="dnevi" id="1_max">'+n_max_t+'°C<hr class="horizontal"/> '+n_min_t+'°C</div></div>');
                }
              }
              else if (isci==-1){
                // $('#'+st_dan+'_max').html(n_max_t + '°F <hr class="horizontal"/>' + n_min_t + '°F');
                if (st_dan==1){
                  $('#d'+st_dan).html('<div class="col-lg-3"><span class="dan">Jutri</span><div class="dnevi" id="1_max">'+
                    n_max_t+'°F<hr class="horizontal"/> '+n_min_t+'°F</div></div>');
                }
                else{
                  $('#d'+st_dan).html('<div class="col-lg-3"><span class="dan">Čez '+
                    st_dan+' dni</span><div class="dnevi" id="1_max">'+n_max_t+'°F<hr class="horizontal"/> '+n_min_t+'°F</div></div>');
                }
              }
              n_max_t=-2000;
              n_min_t=2000;
              st_dan++;
            }
          }
          // html += '<p>Datum: ' + datum +' '+ura+'<b> Temp:  ' + trenutno +'</b> °</p>'
        }
      }
        // $('#show2').html(html);
    }

    /*Funkcije za osebe, animacije, oblake*/
    function pomlad(){
      c.beginPath();
      c.lineCap='round';
      c.lineWidth=4;
      c.arc(160, 200, 30, 0, Math.PI * 2, true); // Outer circle
      c.fillStyle="#ffddb3";
      c.fill();
      c.stroke();

      c.beginPath();
      // c.moveTo(150,215);
      // c.arc(160,210,10,1*Math.PI,0,true);
      c.moveTo(145,210);
      c.bezierCurveTo(150,220,170,220,175,210);
      // c.lineTo(170,215);
      c.stroke();

      c.beginPath();
      c.lineWidth=3;
      c.arc(150, 195, 5, 0, Math.PI * 2, true);  // Left eye
      c.fillStyle="white";
      c.fill();
      c.stroke();

        c.beginPath();
        c.arc(170, 195, 5, 0, Math.PI * 2, true);  // Right eye
      c.fillStyle="white";
      c.fill();
        c.stroke();
      // vrat posebej
      c.beginPath();
      c.lineWidth=4;
      c.moveTo(152,230);
      c.lineTo(166,230);
      c.lineTo(166,242);
      c.lineTo(152,242);
      c.lineTo(152,230);
      c.fillStyle="#ffddb3";
      c.fill();
      c.stroke();

        // leva roka
      c.beginPath();
      c.moveTo(125,262);
      c.lineTo(125,325);
      c.lineTo(140,325);
      c.lineTo(140,262);
      c.lineTo(125,262);
      c.fillStyle="#ffddb3";
      c.fill();
      c.stroke();

        // desna roka
      c.beginPath();
      c.moveTo(193,262);
      c.lineTo(193,325);
      c.lineTo(178,325);
      c.lineTo(178,262);
      c.lineTo(193,262);
      c.fillStyle="#ffddb3";
      c.fill();
      c.stroke();

        // leva noga
      c.beginPath();
      c.moveTo(142,372);
      c.lineTo(142,430);
      c.lineTo(155,430);
      c.lineTo(155,372);
      c.fillStyle="#ffddb3";
      c.fill();
      c.stroke();

      // desna noga
      c.beginPath();
      c.moveTo(176,372);
      c.lineTo(176,430);
      c.lineTo(163,430);
      c.lineTo(163,372);
      c.fillStyle="#ffddb3";
      c.fill();
      c.stroke();

      // hlace
      c.beginPath();
      c.moveTo(140,311);
      c.lineTo(178,311);
      c.lineTo(180,425);
      c.lineTo(138,425);
      c.lineTo(140,311);
      c.moveTo(159,425);
      c.lineTo(159,340);
      c.fillStyle="cornflowerblue";
      c.fill();
      c.closePath();
      c.stroke();
      // zep
      c.beginPath();
      c.arc(143,325,8,0*Math.PI,0.5*Math.PI,false);
      c.stroke();
      c.beginPath();
      c.arc(175,325,8,1*Math.PI,0.5*Math.PI,true);
      c.stroke();

      // cevlji
      // levi
      c.beginPath();
      c.moveTo(176,425);
      c.lineTo(163,425);
      c.lineTo(163,430);
      c.lineTo(176,430);
      c.lineTo(176,425);
      c.fillStyle='black';
      c.fill();
      c.stroke();

      // desni
      c.beginPath();
      c.moveTo(142,425);
      c.lineTo(155,425);
      c.lineTo(155,430);
      c.lineTo(142,430);
      c.lineTo(142,425);
      c.fillStyle='black';
      c.fill();
      c.stroke();

      // sredina
      c.beginPath();
      c.moveTo(170,430);
      c.lineTo(170,425);
      c.moveTo(148,430);
      c.lineTo(148,425);
      c.lineWidth=2;
      c.strokeStyle='white';
      c.stroke();

      c.lineWidth=4;
      c.strokeStyle='black';
      // majca
        c.beginPath();
      c.moveTo(166,242);
      c.lineTo(152,242);
      c.lineTo(145,242);
      c.arc(145,262,20,1.5*Math.PI,1*Math.PI,true);
      // c.moveTo(125,262);
      c.lineTo(140,262);
      c.lineTo(140,325);
      c.lineTo(178,325);
      c.lineTo(178,262);
      c.lineTo(193,262);
      c.arc(173,262,20,0*Math.PI,1.5*Math.PI,true);
      c.lineTo(166,242);
      c.fillStyle="darkorange";
      c.fill();
      c.stroke();
      c.beginPath();
      c.moveTo(165,262);
      c.lineTo(170,262);
      c.stroke();

    }

    function pomlad_dez() {

      c.beginPath();
      c.lineCap='round';
      c.lineWidth=4;
      c.arc(160, 200, 30, 0, Math.PI * 2, true); // Outer circle
      c.fillStyle="#ffddb3";
      c.fill();
      c.stroke();

      c.beginPath();
      c.moveTo(150,215);
      c.lineTo(170,215);
      c.stroke();


        c.beginPath();
      c.lineWidth=3;
        c.arc(150, 195, 5, 0, Math.PI * 2, true);  // Left eye
      c.fillStyle="white";
      c.fill();
        c.stroke();

        c.beginPath();
        c.arc(170, 195, 5, 0, Math.PI * 2, true);  // Right eye
      c.fillStyle="white";
      c.fill();
        c.stroke();
      // vrat posebej
      c.beginPath();
      c.lineWidth=4;
      c.moveTo(152,230);
      c.lineTo(166,230);
      c.lineTo(166,242);
      c.lineTo(152,242);
      c.lineTo(152,230);
      c.fillStyle="#ffddb3";
      c.fill();
      c.stroke();

        // leva roka
      c.beginPath();
      c.moveTo(125,262);
      c.lineTo(125,325);
      c.lineTo(140,325);
      c.lineTo(140,262);
      c.lineTo(125,262);
      c.fillStyle="#ffddb3";
      c.fill();
      c.stroke();

        // desna roka
      /*c.beginPath();
      c.moveTo(193,262);
      c.lineTo(193,325);
      c.lineTo(178,325);
      c.lineTo(178,262);
      c.lineTo(193,262);
      c.fillStyle="#ffddb3";
      c.fill();
      c.stroke();
    */
        // leva noga
      c.beginPath();
      c.moveTo(142,372);
      c.lineTo(142,430);
      c.lineTo(155,430);
      c.lineTo(155,372);
      c.fillStyle="#ffddb3";
      c.fill();
      c.stroke();

      // desna noga
      c.beginPath();
      c.moveTo(176,372);
      c.lineTo(176,430);
      c.lineTo(163,430);
      c.lineTo(163,372);
      c.fillStyle="#ffddb3";
      c.fill();
      c.stroke();

      // hlace
      c.beginPath();
      c.moveTo(140,311);
      c.lineTo(178,311);
      c.lineTo(180,425);
      c.lineTo(138,425);
      c.lineTo(140,311);
      c.moveTo(159,425);
      c.lineTo(159,340);
      c.fillStyle="cornflowerblue";
      c.fill();
      c.closePath();
      c.stroke();
      // zep
      c.beginPath();
      c.arc(143,325,8,0*Math.PI,0.5*Math.PI,false);
      c.stroke();
      c.beginPath();
      c.arc(175,325,8,1*Math.PI,0.5*Math.PI,true);
      c.stroke();

      // cevlji
      // levi
      c.beginPath();
      c.moveTo(176,425);
      c.lineTo(163,425);
      c.lineTo(163,430);
      c.lineTo(176,430);
      c.lineTo(176,425);
      c.fillStyle='black';
      c.fill();
      c.stroke();


      // desni
      c.beginPath();
      c.moveTo(142,425);
      c.lineTo(155,425);
      c.lineTo(155,430);
      c.lineTo(142,430);
      c.lineTo(142,425);
      c.fillStyle='black';
      c.fill();
      c.stroke();

      // sredina
      c.beginPath();
      c.moveTo(170,430);
      c.lineTo(170,425);
      c.moveTo(148,430);
      c.lineTo(148,425);
      c.lineWidth=2;
      c.strokeStyle='white';
      c.stroke();

      c.lineWidth=4;
      c.strokeStyle='black';

      // majica
      c.beginPath();
      c.moveTo(166,242);
      c.lineTo(152,242);
      c.lineTo(145,242);
      c.arc(145,262,20,1.5*Math.PI,1*Math.PI,true);
      // c.moveTo(125,262);
      c.lineTo(140,262);
      c.lineTo(140,325);
      c.lineTo(178,325);
      c.lineTo(178,262);
      c.lineTo(193,262);
      c.arc(173,262,20,0*Math.PI,1.5*Math.PI,true);
      c.lineTo(166,242);
      c.fillStyle="darkorange";
      c.fill();
      c.stroke();
      c.beginPath();
      c.moveTo(165,262);
      c.lineTo(170,262);
      c.stroke();

      // koscek roke
      c.beginPath();
      c.moveTo(178,262);
      c.lineTo(193,262);
      c.lineTo(193,290);
      c.lineTo(178,290);
      c.closePath();
      c.fillStyle="#ffddb3";
      c.fill();
      c.stroke();
      // pokrcena roka
      c.beginPath();
      c.moveTo(178,290);
      c.lineTo(191,253);
      c.lineTo(205,253);
      c.lineTo(193,290);
      c.lineTo(178,290);
      c.fillStyle="#ffddb3";
      c.fill();
      c.stroke();

      // deznik
      c.lineWidth=5;
      c.beginPath();
      c.moveTo(198,244);
      c.lineTo(198,160);
      // rocaj
      c.moveTo(198,244);
      c.arc(208,248,10,1*Math.PI,0*Math.PI,true);
      c.stroke();
      c.lineWidth=4;
      // spic
        c.lineWidth=5;
      c.beginPath();
      c.moveTo(198,123);
      c.lineTo(198,120);
      c.stroke();
      // desna roka
      c.lineWidth=4;
      c.beginPath();
      c.moveTo(191,253);
      c.lineTo(205,253);
      c.lineTo(205,245);
      c.lineTo(191,245);
      c.lineTo(191,253);
      c.fillStyle="#ffddb3";
      c.fill();
      c.stroke();
      // krog

      c.beginPath();
      c.moveTo(112,160);
      c.bezierCurveTo(176,115,216,115,280,160);
      c.lineTo(112,160);
      c.fillStyle="grey";
      c.fill();
      c.stroke();

      // linije na krogu
      c.lineWidth=2;
      c.beginPath();
      c.moveTo(132,160);
      c.lineTo(132,150);
      c.moveTo(152,160);
      c.lineTo(152,136);
      c.moveTo(172,160);
      c.lineTo(172,130);
      c.moveTo(192,160);
      c.lineTo(192,128);
      c.moveTo(212,160);
      c.lineTo(212,127);
      c.moveTo(232,160);
      c.lineTo(232,135);
      c.moveTo(252,160);
      c.lineTo(252,142);
      c.stroke();
      c.lineWidth=4;
    }

    function zima() {
      c.beginPath();
      c.lineCap='round';
      c.lineWidth=4;
      c.arc(160, 200, 30, 0, Math.PI * 2, true); // obraz
      c.fillStyle="#ffddb3";
      c.fill();
      c.stroke();

      c.beginPath();
      c.moveTo(145,210);
      c.bezierCurveTo(150,220,170,220,175,210);
      c.stroke();

        c.beginPath();
      c.lineWidth=3;
        c.arc(150, 195, 5, 0, Math.PI * 2, true);  // levo oko
      c.fillStyle="white";
      c.fill();
        c.stroke();

        c.beginPath();
        c.arc(170, 195, 5, 0, Math.PI * 2, true);  // desno oko
      c.fillStyle="white";
      c.fill();
        c.stroke();
      // vrat posebej
      c.beginPath();
      c.lineWidth=4;
      c.moveTo(152,230);
      c.lineTo(166,230);
      c.lineTo(166,242);
      c.lineTo(152,242);
      c.lineTo(152,230);
      c.fillStyle="#ffddb3";
      c.fill();
      c.stroke();
      // leva roka
      c.beginPath();
      c.moveTo(125,262);
      c.lineTo(125,325);
      c.lineTo(140,325);
      c.lineTo(140,262);
      c.lineTo(125,262);
      c.fillStyle="#ffddb3";
      c.fill();
      c.stroke();
      // desna roka
      c.beginPath();
      c.moveTo(193,262);
      c.lineTo(193,325);
      c.lineTo(178,325);
      c.lineTo(178,262);
      c.lineTo(193,262);
      c.fillStyle="#ffddb3";
      c.fill();
      c.stroke();
      // leva noga
      c.beginPath();
      c.moveTo(142,372);
      c.lineTo(142,430);
      c.lineTo(155,430);
      c.lineTo(155,372);
      c.fillStyle="#ffddb3";
      c.fill();
      c.stroke();
      // desna noga
      c.beginPath();
      c.moveTo(176,372);
      c.lineTo(176,430);
      c.lineTo(163,430);
      c.lineTo(163,372);
      c.fillStyle="#ffddb3";
      c.fill();
      c.stroke();
      // hlace
      c.beginPath();
      c.strokeStyle="black";
      c.moveTo(145,311);
      c.bezierCurveTo(135,340,135,360,140,423);
      c.lineTo(179,423);
      c.bezierCurveTo(183,345,183,340,170,311);
      c.closePath();
      c.fillStyle="darkslategrey";
      c.fill();
      c.stroke();

      c.beginPath();
      c.moveTo(159,423);
      c.lineTo(159,340);
      c.stroke();
      // zepi
      c.rect(172, 380, 6, 15);
      c.rect(141, 380, 6, 15);
      c.stroke();
      c.beginPath();
      c.arc(143,335,8,0*Math.PI,0.5*Math.PI,false);
      c.stroke();
      c.beginPath();
      c.arc(175,335,8,1*Math.PI,0.5*Math.PI,true);
      c.stroke();
      // cevlji
      // levi
      c.strokeStyle="#5a2d0c";
      c.beginPath();
      c.moveTo(176,427);
      c.lineTo(163,427);
      c.lineTo(163,430);
      c.lineTo(176,430);
      c.lineTo(176,427);
      c.fillStyle='#5a2d0c';
      c.fill();
      c.stroke();
      // desni
      c.beginPath();
      c.moveTo(142,427);
      c.lineTo(155,427);
      c.lineTo(155,430);
      c.lineTo(142,430);
      c.lineTo(142,427);
      c.fillStyle='#5a2d0c';
      c.fill();
      c.stroke();
      // sredina
      c.beginPath();
      c.moveTo(170,430);
      c.lineTo(170,427);
      c.moveTo(148,430);
      c.lineTo(148,427);
      c.lineWidth=2;
      c.strokeStyle='white';
      c.stroke();
      c.lineWidth=4;
      c.strokeStyle='black';
      // majca
      c.beginPath();
      c.moveTo(166,242);
      c.lineTo(152,242);
      c.lineTo(145,242);
      c.arc(145,262,20,1.5*Math.PI,1*Math.PI,true);
      c.lineTo(140,262);
      c.lineTo(140,325);
      c.lineTo(178,325);
      c.lineTo(178,262);
      c.lineTo(193,262);
      c.arc(173,262,20,0*Math.PI,1.5*Math.PI,true);
      c.lineTo(166,242);
      c.fillStyle="darkorange";
      c.fill();
      c.stroke();
      c.beginPath();
      c.moveTo(165,262);
      c.lineTo(170,262);
      c.stroke();
      // kapa
      c.beginPath();
      c.lineWidth=4;
      c.strokeStyle="black";
      c.moveTo(133,185);
      c.bezierCurveTo(140,160,180,160,187,185);
      c.fillStyle="grey";
      c.fill();
      c.closePath();
      c.stroke();
      // cof
      c.beginPath();
      c.lineWidth=10;
      c.strokeStyle="black";
      c.arc(160,159,2,0*Math.PI,2*Math.PI,true);
      c.stroke();
      c.lineWidth=4;
      c.strokeStyle="black";
      // crte
      c.beginPath();
      c.strokeStyle="black";
      c.lineWidth=3;
      c.moveTo(145,184);
      c.lineTo(145,170);
      c.moveTo(155,184);
      c.lineTo(155,168);
      c.moveTo(165,184);
      c.lineTo(165,168);
      c.moveTo(175,184);
      c.lineTo(175,170);
      c.stroke();
      // rokavice
      c.fillStyle="black";
      c.fillRect(127,315,11,8);
      c.fillRect(180,315,11,8);
      c.stroke();
      // bunda
      c.beginPath();
      c.strokeStyle="black";
      c.moveTo(148,242);
      c.bezierCurveTo(119,242,114,282,123,315);
      c.lineTo(140,315);
      c.lineTo(140,323);
      c.bezierCurveTo(150,330,160,330,177,323);
      c.lineTo(177,315);
      c.lineTo(195,315);
      c.bezierCurveTo(210,262,184,240,164,242);
      c.closePath();
      c.fillStyle="grey";
      c.fill();
      c.stroke();
      // linije
      c.beginPath();
      c.moveTo(140,315);
      c.bezierCurveTo(143,300,147,280,143,270);
      c.moveTo(177,315);
      c.bezierCurveTo(177,300,173,280,177,270);
      c.stroke();
      // zep
      c.rect(160, 260, 15, 6);
      c.stroke();
      // sal
      c.beginPath();
      c.strokeStyle="black";
      c.lineWidth=4;
      c.moveTo(148,230);
      c.lineTo(170,230);
      c.lineTo(170,242);
      c.lineTo(148,242);
      c.lineTo(148,230);
      c.fillStyle="blue";
      c.fill();
      c.stroke();
      c.strokeStyle="black";
      c.beginPath();
      c.moveTo(170,230);
      c.bezierCurveTo(200,240,205,240,210,280);
      c.lineTo(195,280);
      c.bezierCurveTo(190,280,200,250,170,242);
      c.closePath();
      c.fillStyle="blue";
      c.fill();
      c.stroke();
    }

    function dez_jesen() {
      c.beginPath();
      c.lineCap='round';
      c.lineWidth=4;
      c.arc(160, 200, 30, 0, Math.PI * 2, true); // Outer circle
      c.fillStyle="#ffddb3";
      c.fill();
      c.stroke();

      c.beginPath();
      c.moveTo(150,215);
      c.lineTo(170,215);
      c.stroke();


        c.beginPath();
      c.lineWidth=3;
        c.arc(150, 195, 5, 0, Math.PI * 2, true);  // Left eye
      c.fillStyle="white";
      c.fill();
        c.stroke();

        c.beginPath();
        c.arc(170, 195, 5, 0, Math.PI * 2, true);  // Right eye
      c.fillStyle="white";
      c.fill();
        c.stroke();
      // vrat posebej
      c.beginPath();
      c.lineWidth=4;
      c.moveTo(152,230);
      c.lineTo(166,230);
      c.lineTo(166,242);
      c.lineTo(152,242);
      c.lineTo(152,230);
      c.fillStyle="#ffddb3";
      c.fill();
      c.stroke();

        // leva roka
      c.beginPath();
      c.moveTo(125,262);
      c.lineTo(125,325);
      c.lineTo(140,325);
      c.lineTo(140,262);
      c.lineTo(125,262);
      c.fillStyle="#ffddb3";
      c.fill();
      c.stroke();

        // desna roka
      c.beginPath();
      c.moveTo(193,262);
      c.lineTo(193,325);
      c.lineTo(178,325);
      c.lineTo(178,262);
      c.lineTo(193,262);
      c.fillStyle="#ffddb3";
      c.fill();
      c.stroke();

        // leva noga
      c.beginPath();
      c.moveTo(142,372);
      c.lineTo(142,430);
      c.lineTo(155,430);
      c.lineTo(155,372);
      c.fillStyle="#ffddb3";
      c.fill();
      c.stroke();

      // desna noga
      c.beginPath();
      c.moveTo(176,372);
      c.lineTo(176,430);
      c.lineTo(163,430);
      c.lineTo(163,372);
      c.fillStyle="#ffddb3";
      c.fill();
      c.stroke();

      // hlace
      c.beginPath();
      c.moveTo(140,311);
      c.lineTo(178,311);
      c.lineTo(180,425);
      c.lineTo(138,425);
      c.lineTo(140,311);
      c.moveTo(159,425);
      c.lineTo(159,340);
      c.fillStyle="grey";
      c.fill();
      c.closePath();
      c.stroke();
      // zep
      c.beginPath();
      c.arc(143,325,8,0*Math.PI,0.5*Math.PI,false);
      c.stroke();
      c.beginPath();
      c.arc(175,325,8,1*Math.PI,0.5*Math.PI,true);
      c.stroke();

      // cevlji
      // levi
      c.beginPath();
      c.moveTo(176,425);
      c.lineTo(163,425);
      c.lineTo(163,430);
      c.lineTo(176,430);
      c.lineTo(176,425);
      c.fillStyle='black';
      c.fill();
      c.stroke();


      // desni
      c.beginPath();
      c.moveTo(142,425);
      c.lineTo(155,425);
      c.lineTo(155,430);
      c.lineTo(142,430);
      c.lineTo(142,425);
      c.fillStyle='black';
      c.fill();
      c.stroke();

      // sredina
      c.beginPath();
      c.moveTo(170,430);
      c.lineTo(170,425);
      c.moveTo(148,430);
      c.lineTo(148,425);
      c.lineWidth=2;
      c.strokeStyle='white';
      c.stroke();

      c.lineWidth=4;
      c.strokeStyle='black';
      // jakna
      c.beginPath();
      c.moveTo(166,242);
      c.lineTo(152,242);
      c.lineTo(145,242);
      c.arc(145,262,20,1.5*Math.PI,1*Math.PI,true);
      // c.moveTo(125,262);
      c.lineTo(125,317);
      c.lineTo(140,317);
      c.lineTo(140,320);
      c.lineTo(178,320);
      c.lineTo(178,317);
      c.lineTo(193,317);
      c.lineTo(193,262);
      c.arc(173,262,20,0*Math.PI,1.5*Math.PI,true);
      c.lineTo(168,242);
      c.lineTo(168,230);
      c.lineTo(150,230);
      c.lineTo(150,242);
      c.fillStyle="skyblue";
      c.fill();
      c.stroke();

      c.beginPath();
      c.moveTo(140,320);
      c.lineTo(140,262);
      c.moveTo(178,320);
      c.lineTo(178,262);
      c.moveTo(159,320);
      c.lineTo(159,230);
      // c.lineTo(140,262);
      c.stroke();

      // zep
      c.beginPath();
      c.moveTo(166,262);
      c.lineTo(171,262);
      c.stroke();

      // zepa
      c.beginPath();
      c.arc(143,305,8,0*Math.PI,0.5*Math.PI,false);
      c.stroke();
      c.beginPath();
      c.arc(175,305,8,1*Math.PI,0.5*Math.PI,true);
      c.stroke();



    }

    function jesen_deznik() {

      c.beginPath();
      c.lineCap='round';
      c.lineWidth=4;
      c.arc(160, 200, 30, 0, Math.PI * 2, true); // Outer circle
      c.fillStyle="#ffddb3";
      c.fill();
      c.stroke();

      c.beginPath();
      c.moveTo(150,215);
      c.lineTo(170,215);
      c.stroke();


        c.beginPath();
      c.lineWidth=3;
        c.arc(150, 195, 5, 0, Math.PI * 2, true);  // Left eye
      c.fillStyle="white";
      c.fill();
        c.stroke();

        c.beginPath();
        c.arc(170, 195, 5, 0, Math.PI * 2, true);  // Right eye
      c.fillStyle="white";
      c.fill();
        c.stroke();
      // vrat posebej
      c.beginPath();
      c.lineWidth=4;
      c.moveTo(152,230);
      c.lineTo(166,230);
      c.lineTo(166,242);
      c.lineTo(152,242);
      c.lineTo(152,230);
      c.fillStyle="#ffddb3";
      c.fill();
      c.stroke();

        // leva roka
      c.beginPath();
      c.moveTo(125,262);
      c.lineTo(125,325);
      c.lineTo(140,325);
      c.lineTo(140,262);
      c.lineTo(125,262);
      c.fillStyle="#ffddb3";
      c.fill();
      c.stroke();

        // desna roka
      /*c.beginPath();
      c.moveTo(193,262);
      c.lineTo(193,325);
      c.lineTo(178,325);
      c.lineTo(178,262);
      c.lineTo(193,262);
      c.fillStyle="#ffddb3";
      c.fill();
      c.stroke();
    */
        // leva noga
      c.beginPath();
      c.moveTo(142,372);
      c.lineTo(142,430);
      c.lineTo(155,430);
      c.lineTo(155,372);
      c.fillStyle="#ffddb3";
      c.fill();
      c.stroke();

      // desna noga
      c.beginPath();
      c.moveTo(176,372);
      c.lineTo(176,430);
      c.lineTo(163,430);
      c.lineTo(163,372);
      c.fillStyle="#ffddb3";
      c.fill();
      c.stroke();

      // hlace
      c.beginPath();
      c.moveTo(140,311);
      c.lineTo(178,311);
      c.lineTo(180,425);
      c.lineTo(138,425);
      c.lineTo(140,311);
      c.moveTo(159,425);
      c.lineTo(159,340);
      c.fillStyle="grey";
      c.fill();
      c.closePath();
      c.stroke();
      // zep
      c.beginPath();
      c.arc(143,325,8,0*Math.PI,0.5*Math.PI,false);
      c.stroke();
      c.beginPath();
      c.arc(175,325,8,1*Math.PI,0.5*Math.PI,true);
      c.stroke();

      // cevlji
      // levi
      c.beginPath();
      c.moveTo(176,425);
      c.lineTo(163,425);
      c.lineTo(163,430);
      c.lineTo(176,430);
      c.lineTo(176,425);
      c.fillStyle='black';
      c.fill();
      c.stroke();


      // desni
      c.beginPath();
      c.moveTo(142,425);
      c.lineTo(155,425);
      c.lineTo(155,430);
      c.lineTo(142,430);
      c.lineTo(142,425);
      c.fillStyle='black';
      c.fill();
      c.stroke();

      // sredina
      c.beginPath();
      c.moveTo(170,430);
      c.lineTo(170,425);
      c.moveTo(148,430);
      c.lineTo(148,425);
      c.lineWidth=2;
      c.strokeStyle='white';
      c.stroke();

      c.lineWidth=4;
      c.strokeStyle='black';
      // jakna
      c.beginPath();
      c.moveTo(166,242);
      c.lineTo(152,242);
      c.lineTo(145,242);
      c.arc(145,262,20,1.5*Math.PI,1*Math.PI,true);
      // c.moveTo(125,262);
      c.lineTo(125,317);
      c.lineTo(140,317);
      c.lineTo(140,320);
      c.lineTo(178,320);

      c.lineTo(178,290);
      c.lineTo(193,290);
      c.lineTo(193,262);
      c.arc(173,262,20,0*Math.PI,1.5*Math.PI,true);
      c.lineTo(168,242);
      c.lineTo(168,230);
      c.lineTo(150,230);
      c.lineTo(150,242);
      c.fillStyle="skyblue";
      c.fill();
      c.stroke();

      // pokrcena roka
      c.beginPath();
      c.moveTo(178,290);
      c.lineTo(191,253);
      c.lineTo(205,253);
      c.lineTo(193,290);
      c.lineTo(178,290);
      c.fillStyle="skyblue";
      c.fill();
      c.stroke();



      // deznik
      c.lineWidth=5;
      c.beginPath();
      c.moveTo(198,244);
      c.lineTo(198,160);
      // rocaj
      c.moveTo(198,244);
      c.arc(208,248,10,1*Math.PI,0*Math.PI,true);
      c.stroke();
      c.lineWidth=4;
      // spic
        c.lineWidth=5;
      c.beginPath();
      c.moveTo(198,123);
      c.lineTo(198,120);
      c.stroke();
      // desna roka
      c.lineWidth=4;
      c.beginPath();
      c.moveTo(193,253);
      c.lineTo(204,253);
      c.lineTo(204,245);
      c.lineTo(193,245);
      c.lineTo(193,253);
      c.fillStyle="#ffddb3";
      c.fill();
      c.stroke();
      // krog

      c.beginPath();
      c.moveTo(112,160);
      c.bezierCurveTo(176,115,216,115,280,160);
      c.lineTo(112,160);
      c.fillStyle="grey";
      c.fill();
      c.stroke();

      // linije na krogu
      c.lineWidth=2;
      c.beginPath();
      c.moveTo(132,160);
      c.lineTo(132,150);
      c.moveTo(152,160);
      c.lineTo(152,136);
      c.moveTo(172,160);
      c.lineTo(172,130);
      c.moveTo(192,160);
      c.lineTo(192,128);
      c.moveTo(212,160);
      c.lineTo(212,127);
      c.moveTo(232,160);
      c.lineTo(232,135);
      c.moveTo(252,160);
      c.lineTo(252,142);
      c.stroke();

      c.lineWidth=4;
      c.beginPath();
      c.moveTo(140,320);
      c.lineTo(140,262);
      c.moveTo(178,320);
      c.lineTo(178,262);
      c.moveTo(159,320);
      c.lineTo(159,230);
      // c.lineTo(140,262);
      c.stroke();

      // zep
      c.beginPath();
      c.moveTo(166,262);
      c.lineTo(171,262);
      c.stroke();

      // zepa
      c.beginPath();
      c.arc(143,305,8,0*Math.PI,0.5*Math.PI,false);
      c.stroke();
      c.beginPath();
      c.arc(175,305,8,1*Math.PI,0.5*Math.PI,true);
      c.stroke();

    }

    function kopalke() {
          c.beginPath();
        c.lineCap='round';
        c.lineWidth=4;
      c.arc(160, 200, 30, 0, Math.PI * 2, true); // Outer circle
      c.fillStyle="#ffddb3";
      c.fill();
      c.stroke();
      c.beginPath();
        c.arc(160, 210, 15, 0, Math.PI, false);  // Mouth (clockwise)
        c.fillStyle="white";
      c.fill();
      c.stroke();

      c.beginPath();
      c.moveTo(145,210);
      c.lineTo(175,210);
      c.stroke();

        c.beginPath();
      c.lineWidth=3;
        c.arc(150, 195, 5, 0, Math.PI * 2, true);  // Left eye
      c.fillStyle="white";
      c.fill();
        c.stroke();

        c.beginPath();
        c.arc(170, 195, 5, 0, Math.PI * 2, true);  // Right eye
      c.fillStyle="white";
      c.fill();
        c.stroke();
      /*//vrat
      c.beginPath();
      c.lineWidth='4';
      c.moveTo(152,230);
      c.lineTo(152,242);
      c.moveTo(166,230);
      c.lineTo(166,242);
      c.moveTo(152,230);
      c.lineTo(166,230);
      c.stroke();

      //leva rama
      c.beginPath();
      c.lineWidth='4';
      c.moveTo(152,242);
      c.lineTo(145,242);
      c.stroke();
      c.beginPath();
      c.arc(145,262,20,1*Math.PI,1.5*Math.PI,false);
      c.stroke();

      //desna rama
      c.beginPath();
      c.moveTo(166,242);
      c.lineTo(173,242);
      c.stroke();
      c.beginPath();
      c.arc(173,262,20,1.5*Math.PI,0*Math.PI,false);
      c.stroke();
      //leva roka
      c.beginPath();
      c.moveTo(125,262);
      c.lineTo(125,325);
      //konec
      c.stroke();
      //desna roka
      c.beginPath();
      c.moveTo(193,262);
      c.lineTo(193,325);
      c.stroke();
      //konec
      c.beginPath();
      c.moveTo(125,325);
      c.lineTo(193,325);
      c.stroke();
      */
      // pas
      /*
      c.moveTo(140,320);
      c.lineTo(178,320);
      c.stroke();
      */
      // vrat, telo
      c.beginPath();
      c.lineWidth=4;
      c.moveTo(166,242);
      // c.moveTo(152,230);
      c.lineTo(166,230);
      c.lineTo(152,230);
      c.lineTo(152,242);
      // c.fillStyle="#ffddb3";
      // c.fill();
      c.lineTo(145,242);
      c.arc(145,262,20,1.5*Math.PI,1*Math.PI,true);
      c.moveTo(125,262);
      c.lineTo(125,325);

      c.lineTo(193,325);
      c.lineTo(193,262);
      c.arc(173,262,20,0*Math.PI,1.5*Math.PI,true);
      c.lineTo(166,242);

      c.fillStyle="#ffddb3";
      c.fill();
      c.stroke();
        // telo leva stran
      c.beginPath();
      c.moveTo(140,265);
      c.lineTo(140,320);
      c.stroke();
      // telo desna stran
      c.beginPath();
      c.moveTo(178,265);
      c.lineTo(178,320);
      c.stroke();


      // kopalke
      c.beginPath();
      c.moveTo(140,311);
      c.lineTo(178,311);
      c.lineTo(181,370);
      c.lineTo(137,370);
      c.lineTo(140,311);
      c.moveTo(159,370);
      c.lineTo(159,340);
      c.fillStyle="lightblue";
      c.fill();
      c.closePath();
      c.stroke();

      // leva noga
      c.beginPath();
      c.moveTo(142,372);
      c.lineTo(142,430);
      c.lineTo(155,430);
      c.lineTo(155,372);
      c.fillStyle="#ffddb3";
      c.fill();
      c.stroke();

      // desna noga
      c.beginPath();
      c.moveTo(176,372);
      c.lineTo(176,430);
      c.lineTo(163,430);
      c.lineTo(163,372);
      c.fillStyle="#ffddb3";
      c.fill();
      c.stroke();
    }

    function poletje() {
      c.beginPath();
        c.lineCap='round';
        c.lineWidth=4;
      c.arc(160, 200, 30, 0, Math.PI * 2, true); // Outer circle
      c.fillStyle="#ffddb3";
      c.fill();
      c.stroke();
      c.beginPath();
        c.arc(160, 210, 15, 0, Math.PI, false);  // Mouth (clockwise)
        c.fillStyle="white";
      c.fill();
      c.stroke();

      c.beginPath();
      c.moveTo(145,210);
      c.lineTo(175,210);
      c.stroke();


        c.beginPath();
      c.lineWidth=3;
        c.arc(150, 195, 5, 0, Math.PI * 2, true);  // Left eye
      c.fillStyle="white";
      c.fill();
        c.stroke();

        c.beginPath();
        c.arc(170, 195, 5, 0, Math.PI * 2, true);  // Right eye
      c.fillStyle="white";
      c.fill();
        c.stroke();
      /*//vrat
      c.beginPath();
      c.lineWidth='4';
      c.moveTo(152,230);
      c.lineTo(152,242);
      c.moveTo(166,230);
      c.lineTo(166,242);
      c.moveTo(152,230);
      c.lineTo(166,230);
      c.stroke();

      //leva rama
      c.beginPath();
      c.lineWidth='4';
      c.moveTo(152,242);
      c.lineTo(145,242);
      c.stroke();
      c.beginPath();
      c.arc(145,262,20,1*Math.PI,1.5*Math.PI,false);
      c.stroke();

      //desna rama
      c.beginPath();
      c.moveTo(166,242);
      c.lineTo(173,242);
      c.stroke();
      c.beginPath();
      c.arc(173,262,20,1.5*Math.PI,0*Math.PI,false);
      c.stroke();
      //leva roka
      c.beginPath();
      c.moveTo(125,262);
      c.lineTo(125,325);
      //konec
      c.stroke();
      //desna roka
      c.beginPath();
      c.moveTo(193,262);
      c.lineTo(193,325);
      c.stroke();
      //konec
      c.beginPath();
      c.moveTo(125,325);
      c.lineTo(193,325);
      c.stroke();
      */
      // pas
      /*
      c.moveTo(140,320);
      c.lineTo(178,320);
      c.stroke();
      */
      // vrat posebej
      c.beginPath();
      c.lineWidth=4;
      c.moveTo(152,230);
      c.lineTo(166,230);
      c.lineTo(166,242);
      c.lineTo(152,242);
      c.lineTo(152,230);
      c.fillStyle="#ffddb3";
      c.fill();
      c.stroke();

      // majica
      c.beginPath();
      c.moveTo(166,242);
      c.lineTo(152,242);
      c.lineTo(145,242);
      c.arc(145,262,20,1.5*Math.PI,1*Math.PI,true);
      // c.moveTo(125,262);
      c.lineTo(140,262);
      c.lineTo(140,325);
      c.lineTo(178,325);
      c.lineTo(178,262);
      c.lineTo(193,262);
      c.arc(173,262,20,0*Math.PI,1.5*Math.PI,true);
      c.lineTo(166,242);
      c.fillStyle="red";
      c.fill();
      c.stroke();
      c.beginPath();
      c.moveTo(165,262);
      c.lineTo(170,262);
      c.stroke();




      // hlace
      c.beginPath();
      c.moveTo(140,311);
      c.lineTo(178,311);
      c.lineTo(181,370);
      c.lineTo(137,370);
      c.lineTo(140,311);
      c.moveTo(159,370);
      c.lineTo(159,340);
      c.fillStyle="green";
      c.fill();
      c.closePath();
      c.stroke();
      // zep
      c.beginPath();
      c.arc(143,320,8,0*Math.PI,0.5*Math.PI,false);
      c.stroke();
      c.beginPath();
      c.arc(175,320,8,1*Math.PI,0.5*Math.PI,true);
      c.stroke();


      // leva noga
      c.beginPath();
      c.moveTo(142,372);
      c.lineTo(142,430);
      c.lineTo(155,430);
      c.lineTo(155,372);
      c.fillStyle="#ffddb3";
      c.fill();
      c.stroke();

      // desna noga
      c.beginPath();
      c.moveTo(176,372);
      c.lineTo(176,430);
      c.lineTo(163,430);
      c.lineTo(163,372);
      c.fillStyle="#ffddb3";
      c.fill();
      c.stroke();

      // obutev
      c.beginPath();

      c.moveTo(176,420);
      c.lineWidth=2;
      c.lineTo(163,420);
      c.moveTo(170,420);
      c.lineTo(170,430);
      c.moveTo(142,420);
      c.lineTo(155,420);
      c.moveTo(148,420);
      c.lineTo(148,430);
      c.stroke();

      c.lineWidth=4;
        // leva roka
      c.beginPath();
      c.moveTo(125,262);
      c.lineTo(125,325);
      c.lineTo(140,325);
      c.lineTo(140,262);
      c.lineTo(125,262);
      c.fillStyle="#ffddb3";
      c.fill();
      c.stroke();

      // desna roka
      c.beginPath();
      c.moveTo(193,262);
      c.lineTo(193,325);
      c.lineTo(178,325);
      c.lineTo(178,262);
      c.lineTo(193,262);
      c.fillStyle="#ffddb3";
      c.fill();
      c.stroke();


    }


    let senca=50;
    let st=0;
    function sonce() {
      const a= setInterval(shadow, 30);
      function shadow() {
        // cc.clearRect(0, 0, 300, 170);
        if (st==0) {
          cc.shadowColor = "darkorange";
          cc.shadowBlur = senca;
          cc.fillStyle = "orange";
          cc.strokeStyle="orange";
          cc.beginPath();
          cc.arc(50, 50, 80, 0, Math.PI * 2, true);
          cc.fill();
          cc.stroke();
          senca=senca+5;
              if (senca==150) {
            st=1;
            senca=50;
            // cc.clearRect(0, 0, 300, 170);
          }
        }

          if (st==1) {
            cc.shadowColor = "white";
            cc.shadowBlur = senca;
            cc.fillStyle = "orange";
            cc.strokeStyle="orange";
            cc.beginPath();
            cc.arc(50, 50, 80, 0, Math.PI * 2, true);
            cc.fill();
            cc.stroke();
            senca=senca+25;


            // clearInterval(a);
            if (senca==550) {
              st=0;
              senca=50;
              // clearInterval(a);
            }
          }
      }

      document.getElementById("zunanji").onmouseout = function() { clearInterval(a) };
    }
    function test() {
      cc.shadowColor = "darkorange";
        cc.shadowBlur = 10;
      cc.fillStyle = "orange";
          cc.strokeStyle="orange";
          cc.beginPath();
          cc.arc(50, 50, 80, 0, Math.PI * 2, true); // Outer circle
          cc.fill();
          cc.stroke();
    }

    function aniDez() {
      // oblak();
        let w = canvas2.width;
        let h = canvas2.height;
        ctx.strokeStyle='#a3c2db';
      ctx.lineWidth = 1;
        ctx.lineCap = 'round';

        let polje = [];
        let st_kapl = 1000;	// intenzivnost dezja oz st kapljic
        for(let a = 0; a < st_kapl; a++) {
          polje.push({
            x: Math.random() * w,
            y: Math.random() * h,
        xs: -4 + Math.random() * 4 + 2, // smer dezja
            ys: Math.random() * 10 + 10,	// hitrost
            l: Math.random() * 1	// dolzina kaplje
          })
        }

        let polje2 = [];			// delci
        for(let b = 0; b < st_kapl; b++) {
          polje2[b] = polje[b];
        }

        function draw() {
          ctx.clearRect(0, 0, w, h);
          for(let c = 0; c < polje2.length; c++) {
            let p = polje2[c];
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(p.x + p.l * p.xs, p.y + p.l * p.ys);
            ctx.stroke();
          }
          move();
        }

        function move() {
          for(let b = 0; b < polje2.length; b++) {
            let p = polje2[b];
            p.x = p.x + p.xs;	// x coordinata
            p.y = p.y + p.ys; // y coordinata
            if(p.x > w || p.y > h) {
              p.x = Math.random() * w;
              p.y = -20;
            }
          }
        }
        let a = setInterval(draw, 30);
        document.getElementById("zunanji").onmouseout = function() { clearInterval(a) };
      document.getElementById("zunanji").onmouseout = function() { ctx.clearRect(0,0,300,300); };


    }
    function oblak_dez() {
      aniDez();
      cc.beginPath();
      // cc.scale(0.5,0.5);
          cc.moveTo(0, 70);
        cc.bezierCurveTo(20,40,70,40,70,70);
        cc.bezierCurveTo(90,50,120,20,125,90);
        cc.bezierCurveTo(160,60,150,120,130,130);
        cc.bezierCurveTo(170,150,120,180,80,150);
        cc.bezierCurveTo(80,175,10,175,0,150);
          cc.closePath();
          cc.lineWidth = 5;
          cc.strokeStyle = 'black';
        cc.fillStyle="grey";
        cc.fill();
          cc.stroke();

        cc.beginPath();
        cc.moveTo(300,65);
        cc.bezierCurveTo(290,50,260,40,220,70);
        cc.bezierCurveTo(210,50,190,65,180,70);
        cc.bezierCurveTo(170,40,140,50,120,80);
        cc.bezierCurveTo(110,60,100,90,125,120);
        cc.bezierCurveTo(130,160,140,170,180,150);
        cc.bezierCurveTo(190,160,240,170,260,150);
        cc.bezierCurveTo(270,170,290,170,300,160);
        cc.closePath();
        cc.strokeStyle = 'black';
        cc.fillStyle="grey";
        cc.fill();
        cc.stroke();



    }

    function rahel_aniDez() {
      // oblak();
        let w = canvas2.width;
        let h = canvas2.height;
        ctx.strokeStyle='#a3c2db';
      ctx.lineWidth = 1;
        ctx.lineCap = 'round';

        let polje = [];
        let st_kapl = 700;	// intenzivnost dezja oz st kapljic
        for(let a = 0; a < st_kapl; a++) {
          polje.push({
            x: Math.random() * w,
            y: Math.random() * h,
        xs: -4 + Math.random() * 4 + 2, // smer dezja
            ys: Math.random() * 7 + 7,	// hitrost
            l: Math.random() * 0.7	// dolzina kaplje
          })
        }

        let polje2 = [];			// delci
        for(let b = 0; b < st_kapl; b++) {
          polje2[b] = polje[b];
        }

        function draw() {
          ctx.clearRect(0, 0, w, h);
          for(let c = 0; c < polje2.length; c++) {
            let p = polje2[c];
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(p.x + p.l * p.xs, p.y + p.l * p.ys);
            ctx.stroke();
          }
          move();
        }

        function move() {
          for(let b = 0; b < polje2.length; b++) {
            let p = polje2[b];
            p.x = p.x + p.xs;	// x coordinata
            p.y = p.y + p.ys; // y coordinata
            if(p.x > w || p.y > h) {
              p.x = Math.random() * w;
              p.y = -20;
            }
          }
        }
        let a = setInterval(draw, 30);
        document.getElementById("zunanji").onmouseout = function() { clearInterval(a) };
    }
    function rahel_oblak_dez() {
      rahel_aniDez();
      cc.beginPath();
      // cc.scale(0.5,0.5);
          cc.moveTo(0, 70);
        cc.bezierCurveTo(20,40,70,40,70,70);
        cc.bezierCurveTo(90,50,120,20,125,90);
        cc.bezierCurveTo(160,60,150,120,130,130);
        cc.bezierCurveTo(170,150,120,180,80,150);
        cc.bezierCurveTo(80,175,10,175,0,150);
          cc.closePath();
          cc.lineWidth = 5;
          cc.strokeStyle = 'black';
        cc.fillStyle="grey";
        cc.fill();
          cc.stroke();

        cc.beginPath();
        cc.moveTo(300,65);
        cc.bezierCurveTo(290,50,260,40,220,70);
        cc.bezierCurveTo(210,50,190,65,180,70);
        cc.bezierCurveTo(170,40,140,50,120,80);
        cc.bezierCurveTo(110,60,100,90,125,120);
        cc.bezierCurveTo(130,160,140,170,180,150);
        cc.bezierCurveTo(190,160,240,170,260,150);
        cc.bezierCurveTo(270,170,290,170,300,160);
        cc.closePath();
        cc.strokeStyle = 'black';
        cc.fillStyle="grey";
        cc.fill();
        cc.stroke();



    }

    function temni_oblak() {
      cc.beginPath();
      // cc.scale(0.5,0.5);
          cc.moveTo(0, 70);
        cc.bezierCurveTo(20,40,70,40,70,70);
        cc.bezierCurveTo(90,50,120,20,125,90);
        cc.bezierCurveTo(160,60,150,120,130,130);
        cc.bezierCurveTo(170,150,120,180,80,150);
        cc.bezierCurveTo(80,175,10,175,0,150);
          cc.closePath();
          cc.lineWidth = 5;
          cc.strokeStyle = 'black';
        cc.fillStyle="grey";
        cc.fill();
          cc.stroke();

        cc.beginPath();
        cc.moveTo(300,65);
        cc.bezierCurveTo(290,50,260,40,220,70);
        cc.bezierCurveTo(210,50,190,65,180,70);
        cc.bezierCurveTo(170,40,140,50,120,80);
        cc.bezierCurveTo(110,60,100,90,125,120);
        cc.bezierCurveTo(130,160,140,170,180,150);
        cc.bezierCurveTo(190,160,240,170,260,150);
        cc.bezierCurveTo(270,170,290,170,300,160);
        cc.closePath();
        cc.strokeStyle = 'black';
        cc.fillStyle="grey";
        cc.fill();
        cc.stroke();



    }

    function svetli_oblak() {
      cc.beginPath();
      // cc.scale(0.5,0.5);
          cc.moveTo(0, 70);
        cc.bezierCurveTo(20,40,70,40,70,70);
        cc.bezierCurveTo(90,50,120,20,125,90);
        cc.bezierCurveTo(160,60,150,120,130,130);
        cc.bezierCurveTo(170,150,120,180,80,150);
        cc.bezierCurveTo(80,175,10,175,0,150);
          cc.closePath();
          cc.lineWidth = 5;
          cc.strokeStyle = 'black';
        cc.fillStyle="lightgrey";
        cc.fill();
          cc.stroke();

        cc.beginPath();
        cc.moveTo(300,65);
        cc.bezierCurveTo(290,50,260,40,220,70);
        cc.bezierCurveTo(210,50,190,65,180,70);
        cc.bezierCurveTo(170,40,140,50,120,80);
        cc.bezierCurveTo(110,60,100,90,125,120);
        cc.bezierCurveTo(130,160,140,170,180,150);
        cc.bezierCurveTo(190,160,240,170,260,150);
        cc.bezierCurveTo(270,170,290,170,300,160);
        cc.closePath();
        cc.strokeStyle = 'black';
        cc.fillStyle="lightgrey";
        cc.fill();
        cc.stroke();



    }

    function aniSneg() {
      // oblak();
        let w = canvas2.width;
        let h = canvas2.height;
        ctx.strokeStyle='azure';
      ctx.lineWidth = 3;
        ctx.lineCap = 'round';

        let polje = [];
        let snezinke = 500;
        for(let a = 0; a < snezinke; a++) {
          polje.push({
            x: Math.random() * w,
            y: Math.random() * h,
        xs: -4 + Math.random() * 2 + 3, // smer
            ys: Math.random() * 2 + 2,	// hitrost
            l: Math.random() * 0.1	// velikost
          })
        }

        let polje2 = [];			// delci
        for(let b = 0; b < snezinke; b++) {
          polje2[b] = polje[b];
        }

        function draw() {
          ctx.clearRect(0, 0, w, h);
          for(let c = 0; c < polje2.length; c++) {
            let p = polje2[c];
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(p.x + p.l * p.xs, p.y + p.l * p.ys);
            ctx.stroke();
          }
          move();
        }

        function move() {
          for(let b = 0; b < polje2.length; b++) {
            let p = polje2[b];
            p.x = p.x + p.xs;	// x coordinata
            p.y = p.y + p.ys; // y coordinata
            if(p.x > w || p.y > h) {
              p.x = Math.random() * w;
              p.y = -20;
            }
          }
        }
        let a = setInterval(draw, 30);
      document.getElementById("dez").style.backgroundColor = "#404040";
      document.getElementById("za_oblak").style.backgroundColor = "#404040";
        document.getElementById("zunanji").onmouseout = function() { clearInterval(a) };
    }
    function oblak_zima() {
      aniSneg();
      // cc.shadowBlur = 0;
      cc.beginPath();
      // cc.scale(0.5,0.5);
          cc.moveTo(0, 70);
        cc.bezierCurveTo(20,40,70,40,70,70);
        cc.bezierCurveTo(90,50,120,20,125,90);
        cc.bezierCurveTo(160,60,150,120,130,130);
        cc.bezierCurveTo(170,150,120,180,80,150);
        cc.bezierCurveTo(80,175,10,175,0,150);
          cc.closePath();
          cc.lineWidth = 5;
          cc.strokeStyle = 'black';
        cc.fillStyle="lightgrey";
        cc.fill();
          cc.stroke();

        cc.beginPath();
        cc.moveTo(300,65);
        cc.bezierCurveTo(290,50,260,40,220,70);
        cc.bezierCurveTo(210,50,190,65,180,70);
        cc.bezierCurveTo(170,40,140,50,120,80);
        cc.bezierCurveTo(110,60,100,90,125,120);
        cc.bezierCurveTo(130,160,140,170,180,150);
        cc.bezierCurveTo(190,160,240,170,260,150);
        cc.bezierCurveTo(270,170,290,170,300,160);
        cc.closePath();
        cc.strokeStyle = 'black';
        cc.fillStyle="lightgrey";
        cc.fill();
        cc.stroke();
    }

    function m_aniSneg() {
      // oblak();
        let w = canvas2.width;
        let h = canvas2.height;
        ctx.strokeStyle='azure';
      ctx.lineWidth = 3;
        ctx.lineCap = 'round';

        let polje = [];
        let snezinke = 1000;
        for(let a = 0; a < snezinke; a++) {
          polje.push({
            x: Math.random() * w,
            y: Math.random() * h,
        xs: -4 + Math.random() * 2 + 3, // smer
            ys: Math.random() * 4 + 3,	// hitrost
            l: Math.random() * 0.1	// velikost
          })
        }

        let polje2 = [];			// delci
        for(let b = 0; b < snezinke; b++) {
          polje2[b] = polje[b];
        }

        function draw() {
          ctx.clearRect(0, 0, w, h);
          for(let c = 0; c < polje2.length; c++) {
            let p = polje2[c];
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(p.x + p.l * p.xs, p.y + p.l * p.ys);
            ctx.stroke();
          }
          move();
        }

        function move() {
          for(let b = 0; b < polje2.length; b++) {
            let p = polje2[b];
            p.x = p.x + p.xs;	// x coordinata
            p.y = p.y + p.ys; // y coordinata
            if(p.x > w || p.y > h) {
              p.x = Math.random() * w;
              p.y = -20;
            }
          }
        }
        let a = setInterval(draw, 30);
      document.getElementById("dez").style.backgroundColor = "#404040";
      document.getElementById("za_oblak").style.backgroundColor = "#404040";
        document.getElementById("zunanji").onmouseout = function() { clearInterval(a) };
    }
    function m_oblak_zima() {
      m_aniSneg();
      // cc.shadowBlur = 0;
      cc.beginPath();
      // cc.scale(0.5,0.5);
          cc.moveTo(0, 70);
        cc.bezierCurveTo(20,40,70,40,70,70);
        cc.bezierCurveTo(90,50,120,20,125,90);
        cc.bezierCurveTo(160,60,150,120,130,130);
        cc.bezierCurveTo(170,150,120,180,80,150);
        cc.bezierCurveTo(80,175,10,175,0,150);
          cc.closePath();
          cc.lineWidth = 5;
          cc.strokeStyle = 'black';
        cc.fillStyle="lightgrey";
        cc.fill();
          cc.stroke();

        cc.beginPath();
        cc.moveTo(300,65);
        cc.bezierCurveTo(290,50,260,40,220,70);
        cc.bezierCurveTo(210,50,190,65,180,70);
        cc.bezierCurveTo(170,40,140,50,120,80);
        cc.bezierCurveTo(110,60,100,90,125,120);
        cc.bezierCurveTo(130,160,140,170,180,150);
        cc.bezierCurveTo(190,160,240,170,260,150);
        cc.bezierCurveTo(270,170,290,170,300,160);
        cc.closePath();
        cc.strokeStyle = 'black';
        cc.fillStyle='lightgrey';
        cc.fill();
        cc.stroke();
    }

  }
}
