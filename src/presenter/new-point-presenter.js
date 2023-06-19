import EditView from '../view/edit-view.js';
import { UserAction, UpdateType } from '../const.js';
import { remove, render, RenderPosition } from '../framework/render.js';

export default class NewPointPresenter {
  #tripPointsContainer = null;
  #handleDataChange = null;
  #handleDestroy = null;
  #newPointComponent = null;

  constructor({ container, onDataChange, onDestroy }) {
    this.#tripPointsContainer = container;
    this.#handleDataChange = onDataChange;
    this.#handleDestroy = onDestroy;
  }

  init(availableDestinations, availableOffers) {
    if (this.#newPointComponent !== null) {
      return;
    }
    this.#newPointComponent = new EditView({
      action: UserAction.ADD_TRIP_POINT,
      onFormSubmit: this.#handleFormSubmit,
      onDeleteClick: this.#handleDeleteClick,
      onFormClose: this.#handleDeleteClick,
      availableDestinations,
      availableOffers,
    });
    render(
      this.#newPointComponent,
      this.#tripPointsContainer,
      RenderPosition.AFTERBEGIN
    );
    document.addEventListener('keydown', this.#escKeyDownHandler);
  }

  destroy() {
    if (this.#newPointComponent === null) {
      return;
    }
    this.#handleDestroy();
    remove(this.#newPointComponent);
    this.#newPointComponent = null;
    document.removeEventListener('keydown', this.#escKeyDownHandler);
  }

  setSaving() {
    this.#newPointComponent.updateElement({
      isDisabled: true,
      isSaving: true,
    });
  }

  setAbortint() {
    const resetFormState = () => {
      this.#newPointComponent.updateElement({
        isDisabled: false,
        isSaving: false,
        isDeleting: false,
      });
    };
    this.#newPointComponent.shake(resetFormState);
  }

  #handleFormSubmit = (tripPoint) => {
    this.#handleDataChange(
      UserAction.ADD_TRIP_POINT,
      UpdateType.MINOR,
      { ...tripPoint }
    );
  };

  #handleDeleteClick = () => {
    this.destroy();
  };

  #escKeyDownHandler = (evt) => {
    if (evt.key === 'Escape' || evt.key === 'Esc') {
      evt.preventDefault();
      this.destroy();
    }
  };
}
