export const sayMessage = message => (
  <div class="message">
    <h1>{message}</h1>
  </div>
);

export const drawGraphic = data => (
  <div class="graphic">
    <svg id="svg" version="1.1" width="100%" viewBox="0 0 480 480">
      <g id="svgg">
        <path id="path0" class="path" fill="none" stroke="#000000" stroke-width="2" stroke-miterlimit="10" d="{data}" />
      </g>
    </svg>
  </div>
);
