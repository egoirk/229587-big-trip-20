import { UpdateType } from '../const.js';
import { RenderPosition, render, remove } from '../framework/render.js';
import InfoView from '../view/info-view.js';

export default class InfoPresenter {
  #container = null;
  #tripPointsModel = null;
  #tripInfoComponent = null;

  constructor({ container, tripPointsModel }) {
    this.#container = container;
    this.#tripPointsModel = tripPointsModel;
    this.#tripPointsModel.addObserver(this.#handleModelEvent);
  }

  init() {
    this.#tripInfoComponent = new InfoView({
      tripRoute: this.#tripPointsModel.tripRoute,
      tripDates: this.#tripPointsModel.tripDates,
      tripTotalPrice: this.#tripPointsModel.tripTotalPrice,
    });
    render(this.#tripInfoComponent, this.#container, RenderPosition.AFTERBEGIN);
  }

  #handleModelEvent = (updateType) => {
    switch (updateType) {
      case UpdateType.PATCH:
      case UpdateType.MINOR:
      case UpdateType.MAJOR:
      case UpdateType.INIT:
        remove(this.#tripInfoComponent);
        this.init();
        break;
    }
  };
}
