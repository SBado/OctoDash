import { Injectable } from '@angular/core';
import { SafeResourceUrl } from '@angular/platform-browser';
import { Router } from '@angular/router';

import { OctoprintService } from './octoprint.service';
import { EnclosureService } from './plugin-service/enclosure.service';
import { PsuControlService } from './plugin-service/psu-control.service';
import { PrinterService } from './printer.service';

@Injectable({
  providedIn: 'root',
})
export class ActionService {
  public iFrameURL: SafeResourceUrl = 'about:blank';
  public actionToConfirm: ActionToConfirm;

  public constructor(
    private printerService: PrinterService,
    private octoprintService: OctoprintService,
    private psuControlService: PsuControlService,
    private enclosureService: EnclosureService,
    private router: Router,
  ) {}

  public doAction(command: string, exit: boolean): void {
    this.executeAction(command);
    if (exit) {
      this.router.navigate(['/main-screen']);
    }
  }

  private executeAction(command: string): void {
    if (/^\[#.*\]$/.test(command)) {
      this.octoprintService.sendSystemCommand(command.match(/(?<=\[#).*(?=\])/)[0], 'custom');
      return;
    }

    switch (command) {
      case '[!DISCONNECT]':
        this.disconnectPrinter();
        break;
      case '[!STOPDASHBOARD]':
        this.stopOctoDash();
        break;
      case '[!RELOAD]':
        this.reloadOctoPrint();
        break;
      case '[!REBOOT]':
        this.rebootPi();
        break;
      case '[!SHUTDOWN]':
        this.shutdownPi();
        break;
      case '[!KILL]':
        this.kill();
        break;
      case '[!POWEROFF]':
        this.psuControlService.changePSUState(false);
        break;
      case '[!POWERON]':
        this.psuControlService.changePSUState(true);
        break;
      case '[!POWERTOGGLE]':
        this.psuControlService.togglePSU();
        break;
      default: {
        if (command.includes('[!WEB]')) {
          this.openIFrame(command.replace('[!WEB]', ''));
        } else if (command.includes('[!NEOPIXEL]')) {
          const values = command.replace('[!NEOPIXEL]', '').split(',');
          this.setLEDColor(values[0], values[1], values[2], values[3]);
        } else {
          this.printerService.executeGCode(command);
        }
        break;
      }
    }
  }

  // [!DISCONNECT]
  private disconnectPrinter(): void {
    this.octoprintService.disconnectPrinter();
  }

  // [!STOPDASHBOARD]
  private stopOctoDash(): void {
    window.close();
  }

  // [!RELOAD]
  private reloadOctoPrint(): void {
    this.octoprintService.sendSystemCommand('restart');
  }

  // [!REBOOT]
  private rebootPi(): void {
    this.octoprintService.sendSystemCommand('reboot');
  }

  // [!SHUTDOWN]
  private shutdownPi(): void {
    this.octoprintService.sendSystemCommand('shutdown');
  }

  // [!KILL]
  private kill(): void {
    this.shutdownPi();
    setTimeout(this.stopOctoDash, 500);
  }

  // [!WEB]
  private openIFrame(url: string): void {
    this.iFrameURL = url;
    const iFrameDOM = document.getElementById('iFrame');
    iFrameDOM.style.display = 'block';
    setTimeout((): void => {
      iFrameDOM.style.opacity = '1';
    }, 50);
  }

  public hideIFrame(): void {
    const iFrameDOM = document.getElementById('iFrame');
    iFrameDOM.style.opacity = '0';
    setTimeout((): void => {
      iFrameDOM.style.display = 'none';
      this.iFrameURL = 'about:blank';
    }, 500);
  }

  private setLEDColor(identifier: string, red: string, green: string, blue: string): void {
    this.enclosureService.setLEDColor(Number(identifier), Number(red), Number(green), Number(blue));
  }
}

export interface ActionToConfirm {
  command: string;
  exit: boolean;
}
