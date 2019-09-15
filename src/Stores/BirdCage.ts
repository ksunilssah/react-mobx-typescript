import { observable, action, computed } from 'mobx';

class BirdStore {
  @observable birds: string[] = [];

  @action addBird = (bird: string) => {
    this.birds.push(bird);
  };

  @computed get birdCount() {
    return this.birds.length;
  }
}

const birdStore = new BirdStore();
export type BirdStoreType = typeof birdStore;
export default birdStore;
