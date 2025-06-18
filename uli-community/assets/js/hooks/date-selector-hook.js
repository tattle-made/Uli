let DateSelectorHook = {
  mounted() {
    console.log("hi");
    thisContext = this;
    element = this.el;
    pushEvent = this.pushEvent;

    start_date = element.children[0];
    end_date = element.children[1];

    // console.log(start_date);

    start_date.addEventListener("change", (e) => {
      console.log(e.target.value);
      thisContext.pushEvent("change-search", {
        name: "date-range",
        type: "start",
        value: e.target.value,
      });
    });

    end_date.addEventListener("change", (e) => {
      console.log(e.target.value);
      thisContext.pushEvent("change-search", {
        name: "date-range",
        type: "end",
        value: e.target.value,
      });
    });
  },
};

export default DateSelectorHook;
