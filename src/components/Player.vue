<template>
    <v-slide-y-reverse-transition>
        <v-card
            class="pa-3 pt-2 rounded-t-xl"
            id="custom_player"
            color="grey"
            :elevation="12"
            v-show="show_player"
            bottom="true;"
            style="position: fixed; z-index: 999; width: -webkit-fill-available; bottom: -4px;"
        >
            <v-row align="center" class="my-0">
                <v-col class="pa-0 mx-3">
                    <v-skeleton-loader v-if="current_loading_song.loading" type="text"></v-skeleton-loader>
                    <div v-else>
                        <div class="subtitle-2 text-center" v-if="current_loaded_song">
                            {{ current_loaded_song.title }}
                        </div>
                        <div class="subtitle-2 text-center" v-else>
                            No song loaded
                        </div>
                    </div>
                </v-col>
                <v-col cols="auto" class="pa-0 mx-2">
                    <v-fab-transition>
                        <v-btn color="secondary" fab width="50" height="50" @click="change_shuffle" :key="shuffle.state">
                            <v-icon>{{ shuffle.icon }}</v-icon>
                        </v-btn>
                    </v-fab-transition>
                </v-col>
                <v-col cols="auto" class="pa-0 mr-3">
                    <v-btn color="tertiary" fab width="50" height="50" @click="show_player = false">
                        <v-icon>mdi-close</v-icon>
                    </v-btn>
                </v-col>
            </v-row>

            <v-row align="center" class="mx-8">
                <v-col class="pa-0">
                    <v-slider
                        hide-details
                        ref="toto"
                        class="my-0 pa-0"
                        v-model="time"
                        thumb-label
                        step="0.001"
                        color="secondary"
                        track-color="primary"
                        track-fill-color="secondary"
                        :min="0"
                        :max="duration"
                        :thumb-size="40"
                    >
                        <template v-slot:thumb-label="{ value }">
                            {{ new Date(value * 1000).toISOString().substr(14, 5) }}
                        </template>
                    </v-slider>
                </v-col>
                <v-col class="text-caption" cols="auto"> {{ new Date(time * 1000).toISOString().substr(14, 5) }} / {{ new Date(duration * 1000).toISOString().substr(14, 5) }} </v-col>
            </v-row>

            <v-row align="center" justify="center" class="my-0">
                <v-col cols="auto" class="mx-auto ml-10">
                    <v-btn color="secondary" fab @click="change_song(false)">
                        <v-icon>mdi-skip-previous</v-icon>
                    </v-btn>
                </v-col>
                <v-col cols="auto" class="mx-auto">
                    <v-btn color="secondary" fab @click="isPlaying = !isPlaying">
                        <v-icon v-if="isPlaying">mdi-pause</v-icon>
                        <v-icon v-else>mdi-play</v-icon>
                    </v-btn>
                </v-col>
                <v-col cols="auto" class="mx-auto mr-10">
                    <v-btn color="secondary" fab @click="change_song(true)">
                        <v-icon>mdi-skip-next</v-icon>
                    </v-btn>
                </v-col>
            </v-row>

            <audio
                hidden
                @timeupdate="time = $event.target.currentTime"
                @durationchange="duration = $event.target.duration"
                ref="audio"
                controls
                preload="auto"
                @canplay="player_is_ready()"
                @ended="change_song(true)"
                autoplay
            >
                <source src="" />
            </audio>
        </v-card>
    </v-slide-y-reverse-transition>
</template>

<script>
export default {
    name: "Player",

    props: ["current_loading_song", "current_loaded_song"],

    data: () => ({
        time: 0,
        isPlaying: false,
        show_player: false,
        duration: "300",
        shuffle: { state: 1, icon: "mdi-shuffle-disabled" }, // 1 normal, 2 shuffle, 3 repeat
    }),
    watch: {
        isPlaying(isPlaying) {
            if (isPlaying) {
                this.play();
            } else {
                this.pause();
            }
        },
        time(time) {
            if (Math.abs(time - this.$refs.audio.currentTime) > 0.5) {
                this.$refs.audio.currentTime = time;
            }
        },
    },
    methods: {
        change_shuffle() {
            if (this.shuffle.state == 3) {
                this.shuffle.state = 1;
                this.shuffle.icon = "mdi-shuffle-disabled";
                return;
            }

            if (this.shuffle.state == 2) {
                this.shuffle.state = 3;
                this.shuffle.icon = "mdi-shuffle-variant";
            }

            if (this.shuffle.state == 1) {
                this.shuffle.state = 2;
                this.shuffle.icon = "mdi-repeat";
            }
        },
        load_song(song) {
            this.$refs.audio.src = "https://my-servo.herokuapp.com/musicAPI/get_audio?id=" + encodeURI(song.id);
            // Then, player_is_ready should fire next
        },
        player_is_ready() {
            this.show_player = true;

            this.play();

            this.$emit("playerIsRready");

            console.log("Player is ready");

            //document.getElementById('custom_player').style.backgroundImage = "url(" + this.current_loaded_song.thumbnail + ")";
        },
        play() {
            this.show_player = true;
            this.isPlaying = true;
            this.$refs.audio.play();
        },
        pause() {
            this.isPlaying = false;
            this.$refs.audio.pause();
        },
    },
};
</script>
