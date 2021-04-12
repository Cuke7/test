<template>
    <v-app v-cloak>
        <v-app-bar app color="primary" dense>
            <v-toolbar-title class="white--text">Auditere 🎧</v-toolbar-title>

            <v-spacer></v-spacer>

            <v-btn class="white--text" icon @click="reset_search()">
                <v-icon>mdi-magnify</v-icon>
            </v-btn>

            <v-switch color="white" v-model="dark_mode_activated" hide-details>
                <v-icon slot="append" color="white">mdi-brightness-6</v-icon>
            </v-switch>

            <template v-slot:extension>
                <v-tabs v-model="tab" :fixed-tabs="true" color="white">
                    <v-tabs-slider color="secondary"></v-tabs-slider>
                    <v-tab>
                        <div class="white--text">Internet</div>
                    </v-tab>
                    <v-tab>
                        <v-icon color="white">mdi-playlist-music</v-icon>
                    </v-tab>
                    <v-tab>
                        <div class="white--text">Playlists</div>
                    </v-tab>
                </v-tabs>
            </template>
        </v-app-bar>

        <v-main>
            <v-tabs-items v-model="tab">
                <v-tab-item>
                    <Youtube ref="youtube_tab" @gotSearchResults="got_search_results"></Youtube>
                </v-tab-item>

                <v-tab-item>
                    Hello liste de lecture
                </v-tab-item>

                <v-tab-item>
                    Hello playlists
                </v-tab-item>
            </v-tabs-items>

            <!-- PLAYER FAB -->
            <v-fab-transition>
                <v-btn color="primary" fixed bottom right fab @click="show_player(true)" width="70" height="70">
                    <v-icon>mdi-music-note</v-icon>
                </v-btn>
            </v-fab-transition>

            <Player ref="player"></Player>
        </v-main>
    </v-app>
</template>

<script>
import Youtube from "./components/Youtube";
import Player from "./components/Player";

export default {
    name: "App",

    components: {
        Youtube,
        Player,
    },

    data: () => ({
        dark_mode_activated: true,
        tab: 0,
        song_index: 0,
    }),
    methods: {
        reset_search() {
            this.tab = 0;
            window.scrollTo(0, 0);
            let youtube_tab = this.$refs.youtube_tab;
            youtube_tab.search_query = "";
            youtube_tab.$refs.search_element.focus();
            youtube_tab.search_loading = false;
            this.show_player(false);
        },
        got_search_results() {
            this.song_index = 0;
            this.tab = 0;
            window.scrollTo(0, 0);
            this.show_player(false);
        },
        show_player(bool) {
            this.$refs.player.show_player = bool;
        },
    },
};
</script>
