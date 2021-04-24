<template>
    <div>
        <v-card flat class="ma-5 pa-3 mt-0 rounded mb-12">
            <v-card-title>Youtube playlists</v-card-title>
            <v-divider></v-divider>
            <template v-for="(playlist, index) in playlists">
                <div v-bind:key="index">
                    <v-row align="center" class="mx-4 my-2">
                        <v-col class="my-1 pa-0">
                            <div>
                                {{ playlist.name }}
                            </div>
                        </v-col>
                        <v-col cols="auto" class="my-1 mx-3 pa-0">
                            <v-btn color="secondary" fab height="45" width="45" @click="load_playlist(playlist)">
                                <v-icon>
                                    mdi-playlist-music
                                </v-icon>
                            </v-btn>
                        </v-col>
                        <v-col cols="auto" class="my-1 pa-0">
                            <v-btn
                                color="tertiary"
                                fab
                                height="45"
                                width="45"
                                @click="
                                    sheet = true;
                                    show_player = false;
                                    confirm_playlist_name = playlist.name;
                                "
                            >
                                <v-icon color="white">
                                    mdi-delete
                                </v-icon>
                            </v-btn>
                        </v-col>
                    </v-row>
                    <v-divider></v-divider>
                </div>
            </template>
            <v-card-subtitle class="my-4 mt-8 py-0">Save a new playlist from youtube </v-card-subtitle>
            <v-row align="center" class="ma-3">
                <v-col class="ml-0 pa-0">
                    <v-text-field dense color="primary" label="Playlist URL" outlined hide-details v-model="playlist_url"> </v-text-field>
                </v-col>
                <v-col cols="auto" class="mx-auto">
                    <v-btn fab color="secondary" width="50" height="50" class="ml-auto" @click="add_playlist(playlist_url)" :loading="add_loading">
                        <v-icon>mdi-plus</v-icon>
                    </v-btn>
                </v-col>
            </v-row>
        </v-card>
        <v-bottom-sheet v-model="sheet" persistent>
            <v-sheet class="text-center">
                <div class="pt-3">Supprimer la playlist "{{ confirm_playlist_name }}" ?</div>
                <v-btn
                    class="ma-3 mb-5"
                    color="primary"
                    @click="
                        remove_playlist(confirm_playlist_name);
                        sheet = false;
                    "
                >
                    Oui
                </v-btn>
                <v-btn class="ma-3 mb-5" color="error" @click="sheet = false">
                    Annuler
                </v-btn>
            </v-sheet>
        </v-bottom-sheet>
    </div>
</template>

<script>
export default {
    name: "Playlists",

    data: () => ({
        playlist_url: "",
        add_loading: false,
        sheet: false,
        confirm_playlist_name: "",
        playlists: null,
    }),
    methods: {
        async add_playlist(url) {
            this.add_loading = true;
            let res = await fetch("https://my-servo.herokuapp.com/musicAPI/get_playlist?url=" + encodeURI(url));
            const data = await res.json();
            if (data != null) {
                if (data.playlist.length > 1) {
                    data.url = url;
                    this.playlists.push({ name: data.name, url: data.url });
                    this.add_loading = false;
                    this.playlist_url = "";
                }
            } else {
                this.$emit("errorEvent", "No playlist found, make sure the playlist is not set on private nor contains private videos.");
                this.add_loading = false;
            }
        },
        remove_playlist(name) {
            let newPlaylist = this.playlists.filter(function(el) {
                return el.name != name;
            });
            this.playlists = newPlaylist;
        },
        async load_playlist(playlist) {
            this.tab = 1;
            this.$emit("loadPlaylist");

            let res = await fetch("https://my-servo.herokuapp.com/musicAPI/get_playlist?url=" + encodeURI(playlist.url));
            const data = await res.json();
            //console.log(data);
            if (data != null) {
                if (data.playlist.length > 1) {
                    this.$emit("gotPlaylist", data);
                }
            } else {
                this.$emit("errorEvent", "No playlist found, make sure the playlist is not set on private nor contains private videos.");
            }
        },
    },
    watch: {
        // Fired when the local playlist changed
        playlists(newplaylists) {
            localStorage.playlists = JSON.stringify(newplaylists);
            this.$forceUpdate();
            //console.log("Local : ", this.playlists);
            //console.log("Storage : ", localStorage.playlists);
        },
    },
    mounted: function() {
        this.$nextTick(function() {
            // Local storage stuff
            // When renderer, ensure that the local playlist object syncs with the localStorage version
            if (localStorage.playlists) {
                this.playlists = JSON.parse(localStorage.playlists);
            }

            // Init storage (needed once but well...)
            let playlists = localStorage.playlists;
            //console.log("I got : ", playlists);
            if (playlists == undefined) {
                console.log("Nope, creating...");
                localStorage.playlists = JSON.stringify([]);
            }
        });
    },
};
</script>
