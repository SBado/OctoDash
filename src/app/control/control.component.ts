import { Component } from '@angular/core';
import { SafeResourceUrl } from '@angular/platform-browser';

import { ActionService, ActionToConfirm } from '../action.service';
import { ConfigService } from '../config/config.service';
import { OctoprintPrinterProfileAPI } from '../octoprint-api/printerProfileAPI';
import { PrinterService } from '../printer.service';
import { PrinterProfileService } from '../printerprofile.service';

@Component({
  selector: 'app-control',
  templateUrl: './control.component.html',
  styleUrls: ['./control.component.scss'],
})
export class ControlComponent {
  public printerProfile: OctoprintPrinterProfileAPI;

  public jogDistance = 10;
  public customActions = [];
  public showHelp = false;
  public iFrameURL: SafeResourceUrl = 'about:blank';
  public actionToConfirm: ActionToConfirm;

  public constructor(
    private actionService: ActionService,
    private printerService: PrinterService,
    private printerProfileService: PrinterProfileService,
    private configService: ConfigService,
  ) {
    this.printerProfile = {
      name: '_default',
      model: 'unknown',
      axes: {
        x: { inverted: false },
        y: { inverted: false },
        z: { inverted: false },
      },
    };

    this.customActions = this.configService.getCustomActions();

    this.printerProfileService.getDefaultPrinterProfile().then(profile => {
      this.printerProfile = profile;
    });
  }

  public setDistance(distance: number): void {
    this.jogDistance = distance;
  }

  public moveAxis(axis: string, direction: '+' | '-'): void {
    if (this.printerProfile.axes[axis].inverted == true) {
      direction = direction === '+' ? '-' : '+';
    }

    const distance = Number(direction + this.jogDistance);

    this.printerService.jog(axis === 'x' ? distance : 0, axis === 'y' ? distance : 0, axis === 'z' ? distance : 0);
  }

  public doAction(command: string, exit: boolean, confirm: boolean): void {
    if (confirm) {
      this.actionToConfirm = {
        command,
        exit,
      };
    } else {
      this.actionService.doAction(command, exit);
    }
  }

  public doActionConfirm(): void {
    this.actionService.doAction(this.actionToConfirm.command, this.actionToConfirm.exit);
    this.actionToConfirm = null;
  }

  public doActionNoConfirm(): void {
    this.actionToConfirm = null;
  }

  public hideIFrame(): void {
    this.actionService.hideIFrame();
  }
}
