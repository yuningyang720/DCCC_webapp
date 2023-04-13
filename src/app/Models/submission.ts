
import {Oid} from './oid';
import {MDate} from './mdate';

export interface Submission {
    _id: Oid;
    user: Oid;
    data: any;
    prompt: Oid;
    time: MDate;
    final: boolean;
}
