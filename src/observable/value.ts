import OperatorObservable from '../OperatorObservable';
import Scheduler from '../Scheduler';
import Observer from '../Observer';

class ValueObservable extends OperatorObservable {
  value:any;
  scheduler:Scheduler;
  
  constructor(value:any, scheduler:Scheduler) {
    super(null, null);
    this.value = value;
    this.scheduler = scheduler;  
  }
  
  _subscribe(observer:Observer) {
    var value = this.value;
    var scheduler = this.scheduler;

    if(scheduler) {
        return scheduler.schedule(0, ["N", observer, value], dispatch);
    }

    var result = observer.next(value);

    if(result.done) {
        return;
    }

    observer["return"]();
  }
}

function dispatch(state) {
    var phase = state[0];
    var observer = state[1];
    if(phase === "N") {
        var result = observer.next(state[2]);
        if(!result.done) {
            state[0] = "C";
            this.reschedule(state);
        }
    } else {
        observer["return"]();
    }
}

export default function value(value:any, scheduler:Scheduler=Scheduler.immediate) : OperatorObservable {
    return new ValueObservable(value, scheduler);
};