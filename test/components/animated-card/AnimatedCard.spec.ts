import AnimatedCard from './../../../src/components/animated-card/AnimatedCard';

// given
describe('Class AnimatedCard', () => {
  // given
  const { html } = animatedCardFixture();
  beforeAll(() => {
    document.body.innerHTML = html;
  });
  describe('Method ifCardExists', () => {
    it('should return HTMLInput element', () => {
      expect(AnimatedCard.ifCardExists()).toEqual(true);
    });
  });

  // given
  describe('Method returnThemeClass', () => {});

  // given
  describe('Method resetToDefaultTheme', () => {});

  // given
  describe('Method setThemeProperties', () => {});

  // given
  describe('Method setCardTheme', () => {});

  // given
  describe('Method setValueOnCard', () => {});

  // given
  describe('Method shouldFlipCard', () => {});

  // given
  describe('Method flipCard', () => {});

  // given
  describe('Method flipCardBack', () => {});

  // given
  describe('Method getCardData', () => {});
});

function animatedCardFixture() {
  const instance = new AnimatedCard();
  const html =
    '<div class="st-animated-card" id="st-animated-card"> <div class="st-animated-card__content"> <div class="st-animated-card__side st-animated-card__front" id="st-animated-card-side-front"> <div class="st-animated-card__logos"> <div class="st-animated-card__chip-logo"> <img src="data:image/png;base64,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" alt="Chip logo" id="st-chip-logo"> </div> <div class="st-animated-card__payment-logo"> <img src="data:image/png;base64,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" alt="Payment logo" id="st-payment-logo" class="st-animated-card__payment-logo-img"> </div> </div> <div class="st-animated-card__pan"> <label class="st-animated-card__label">Card number</label> <div class="st-animated-card__value" id="st-animated-card-number"></div> </div> <div class="st-animated-card__expiration-date"> <label class="st-animated-card__label">Expiration date</label> <div class="st-animated-card__value" id="st-animated-card-expiration-date"></div> </div> </div> <div class="st-animated-card__side st-animated-card__back" id="st-animated-card-side-back"> <div class="st-animated-card__signature"></div> <div class="st-animated-card__security-code" id="st-animated-card-security-code"></div> </div> </div> </div>';
  return {
    instance,
    html
  };
}
