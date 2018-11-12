import { Component, AfterViewChecked } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements AfterViewChecked {

  ngAfterViewChecked(): void {
    var canvas = (<HTMLCanvasElement>document.getElementById('logo'));     //html preišče pa da v canvas element
    var c = canvas.getContext('2d');
		c.beginPath();
		c.arc(80,80,30,0,Math.PI*0.5,false);
		c.strokeStyle='#9b7617';
		c.lineWidth=8;
		c.stroke();
		c.beginPath();
		c.arc(80,80,34,0,Math.PI*0.5,false);
		c.strokeStyle='black';
		c.lineWidth=0.5;
		c.stroke();
		c.beginPath();
		c.arc(80,80,27,0,Math.PI*0.5,false);
		c.strokeStyle='black';
		c.lineWidth=0.5;
		c.stroke();
		
		c.beginPath();
		c.arc(80,80,30,1*Math.PI,1.5*Math.PI,false);
		c.strokeStyle='limegreen';
		c.lineWidth=8;
		c.stroke();
		c.beginPath();
		c.arc(80,80,34,1*Math.PI,1.5*Math.PI,false);
		c.strokeStyle='black';
		c.lineWidth=0.5;
		c.stroke();
		
		c.beginPath();
		c.arc(80,80,27,1*Math.PI,1.5*Math.PI,false);
		c.strokeStyle='black';
		c.lineWidth=0.5;
		c.stroke();
		
		
		c.beginPath();
		c.arc(80,80,30,1.5*Math.PI,0*Math.PI,false);
		c.strokeStyle='#33ccff';
		c.lineWidth=8;
		c.stroke();
		
		c.beginPath();
		c.arc(80,80,34,1.5*Math.PI,0*Math.PI,false);
		c.strokeStyle='black';
		c.lineWidth=0.5;
		c.stroke();
		
				c.beginPath();
		c.arc(80,80,27,1.5*Math.PI,0*Math.PI,false);
		c.strokeStyle='black';
		c.lineWidth=0.5;
		c.stroke();
		
		c.beginPath();
		c.arc(80,80,30,0.5*Math.PI,1*Math.PI,false);
		c.strokeStyle='beige';
		c.lineWidth=8;
		c.stroke();
		
		c.beginPath();
		c.arc(80,80,34,0.5*Math.PI,1*Math.PI,false);
		c.strokeStyle='black';
		c.lineWidth=0.5;
		c.stroke();
		c.beginPath();
		c.arc(80,80,27,0.5*Math.PI,1*Math.PI,false);
		c.strokeStyle='black';
		c.lineWidth=0.5;
		c.stroke();

		c.lineWidth=8;
		c.font = '30px verdana';  
    c.strokeStyle = 'white'; 
    c.strokeText('W', 66, 92);
  }
}
