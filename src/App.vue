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
                    <Youtube ref="youtube_tab" @gotSearchResults="got_search_results" @loadSong="load_song_event"></Youtube>
                </v-tab-item>

                <v-tab-item eager>
                    <ListeLecture eager ref="listeLecture_tab"></ListeLecture>
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

            <Player ref="player" v-bind:current_loaded_song="current_loaded_song" v-bind:current_loading_song="current_loading_song" @playerIsRready="player_is_ready_event"></Player>
        </v-main>
    </v-app>
</template>

<script>
import Youtube from "./components/Youtube";
import Player from "./components/Player";
import ListeLecture from "./components/ListeLecture";

export default {
    name: "App",

    components: {
        Youtube,
        Player,
        ListeLecture,
    },

    data: () => ({
        dark_mode_activated: true,
        tab: 0,
        song_index: 0,
        current_loading_song: { loading: false },
        current_loaded_song: null,
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
            console.log(this.$refs.listeLecture_tab);
        },
        show_player(bool) {
            this.$refs.player.show_player = bool;
        },
        load_song_event(song) {
            this.$refs.listeLecture_tab.liste_lecture.list = [song];
            this.$refs.player.load_song(song);

            // Reset all the others items in the search_results
            for (const song_temp of this.$refs.youtube_tab.search_results) {
                song_temp.loaded = false;
                song_temp.loading = false;
            }

            this.current_loading_song = song;
            this.current_loading_song.loading = true;
            // Reset all the others items in the liste_lecture
            // for (const song_temp of this.liste_lecture.list) {
            //     song_temp.loaded = false;
            //     song_temp.loading = false;
            // }
            //this.song_index = song.index;
        },
        player_is_ready_event() {
            this.current_loaded_song = this.current_loading_song;
            this.current_loaded_song.loaded = true;
            this.current_loaded_song.loading = false;

            navigator.mediaSession.metadata.title = this.current_loaded_song.title;
            navigator.mediaSession.metadata.artwork = [{ src: this.current_loaded_song.thumbnail, sizes: "312x312", type: "image/png" }];
            navigator.mediaSession.metadata.artist = this.current_loaded_song.artist;
        },
    },
    watch: {
        dark_mode_activated(val) {
            this.$vuetify.theme.dark = !val;
        },
    },
    mounted: function() {
        this.$nextTick(function() {
            if ("mediaSession" in navigator) {
                // eslint-disable-next-line no-undef
                navigator.mediaSession.metadata = new MediaMetadata({
                    title: "Never Gonna Give You Up",
                    artist: "",
                    album: "",
                    artwork: [
                        { src: "https://dummyimage.com/96x96", sizes: "96x96", type: "image/png" },
                        { src: "https://dummyimage.com/128x128", sizes: "128x128", type: "image/png" },
                        { src: "https://dummyimage.com/192x192", sizes: "192x192", type: "image/png" },
                        { src: "https://dummyimage.com/256x256", sizes: "256x256", type: "image/png" },
                        { src: "https://dummyimage.com/384x384", sizes: "384x384", type: "image/png" },
                        { src: "https://dummyimage.com/512x512", sizes: "512x512", type: "image/png" },
                    ],
                });

                navigator.mediaSession.setActionHandler("play", function() {
                    this.$refs.Player.play();
                });
                navigator.mediaSession.setActionHandler("pause", function() {
                     this.$refs.Player.pause();
                });
                navigator.mediaSession.setActionHandler("seekbackward", function() {});
                navigator.mediaSession.setActionHandler("seekforward", function() {});
                navigator.mediaSession.setActionHandler("previoustrack", function() {
                     this.$refs.Player.change_song(false);
                });
                navigator.mediaSession.setActionHandler("nexttrack", function() {
                     this.$refs.Player.change_song(true);
                });
            }
        });
    },
};
</script>
