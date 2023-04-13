import { Pipe, PipeTransform } from '@angular/core';
import {ProfileKeysService} from '../services/profile-keys.service';

@Pipe({
  name: 'profile'
})
export class ProfilePipe implements PipeTransform {
  constructor(private profile: ProfileKeysService) {
  }
  transform(value: string, def: any): string {
    return this.profile.get(value, def);
  }

}
