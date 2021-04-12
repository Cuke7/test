import Vue from "vue";
import Vuetify from "vuetify/lib/framework";

Vue.use(Vuetify);

export default new Vuetify({
    theme: {
        themes: {
            light: {
                primary: "#000080",
                secondary: "#d1b83d",
                tertiary: "#c9720e",
                grey: "#faf7f7",
                accent: "#3557bd",
            },
            dark: {
                primary: "#000080",
                grey: "#292828",
            },
        },
    },
});
