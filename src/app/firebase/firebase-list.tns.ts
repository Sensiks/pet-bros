import { Observable } from 'rxjs/Observable';
import firebase = require('nativescript-plugin-firebase');
import { FBData } from 'nativescript-plugin-firebase';
import 'rxjs/add/operator/share';

export class FirebaseList<T> {
  private items: Map<string, T>;
  private valueChanges$: Observable<T[]>;


  constructor(private observable: Observable<FBData>, private path: string) {
    this.prepareValueChangesObservable();
  }

  private prepareValueChangesObservable() {
    this.valueChanges$ = new Observable<T[]>((subscriber => {
      this.items = new Map<string, T>();

      const subscription = this.observable.subscribe(item => {
        switch (item.type) {
          case 'ChildAdded':
          case 'ChildChanged':
            item.value.$key = item.key;
            this.items.set(item.key, item.value);
            break;
          case 'ChildRemoved':
            this.items.delete(item.key);
            break;
        }

        const newValues: T[] = Array.from(this.items.values());

        subscriber.next(newValues);
      });

      return () => {
        this.items.clear();
        subscription.unsubscribe();
      };
    }))
    .share();
  }

  public valueChanges(): Observable<T[]> {
    return this.valueChanges$;
  }

  public set(key: string, value: T): Promise<void> {
    return firebase.setValue(`${this.path}/${key}`, value);
  }
  public update(key: string, value: T): Promise<void> {
    return firebase.update(`${this.path}/${key}`, value);
  }
  public remove(key?: string): Promise<void> {
    return firebase.remove(`${this.path}/${key}`);
  }
  public push(value: T): Promise<any> {
    return firebase.push(this.path, value);
  }

}
