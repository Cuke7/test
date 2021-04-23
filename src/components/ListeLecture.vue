<template>
    <div>
        <v-card v-if="liste_lecture.list.length > 0" flat class="ma-4 pa-0">
            <div v-if="liste_lecture.name" class="text-center title">{{ liste_lecture.name }}</div>
        </v-card>

        <template v-if="liste_lecture.loading">
            <template v-for="n in 5">
                <v-skeleton-loader height="100" class="ma-6" type="card" v-bind:key="n"> </v-skeleton-loader>
            </template>
        </template>

        <template v-for="(song, index) in liste_lecture.list">
            <v-card class="ma-4 " color="grey" v-bind:key="index">
                <div class="d-flex flex-no-wrap justify-space-between pa-1">
                    <div class="my-auto ml-2">
                        <div class="subtitle-2">{{ song.title }}</div>
                        <v-card-subtitle class="ma-0 pa-0">{{ song.artist }} ({{ song.duration }}) </v-card-subtitle>
                        <v-row class="my-2" align="center">
                            <div class="mx-2">
                                <v-btn v-if="song.loaded" fab :disabled="true" color="secondary" width="50" height="50">
                                    <v-icon>mdi-music-note</v-icon>
                                </v-btn>
                                <v-btn
                                    v-else
                                    :loading="song.loading"
                                    :disabled="song.loading"
                                    fab
                                    color="secondary"
                                    @click="
                                        current_loading_song = song;
                                        load_song(song);
                                    "
                                    width="50"
                                    height="50"
                                >
                                    <v-icon>mdi-play</v-icon>
                                </v-btn>
                            </div>
                        </v-row>
                    </div>
                    <v-avatar class="my-auto mx-2" size="100">
                        <v-img :src="song.thumbnail"></v-img>
                    </v-avatar>
                </div>
            </v-card>
        </template>
    </div>
</template>

<script>
export default {
    name: "ListeLecture",

    data: () => ({
        liste_lecture: { list: [], name: "", loading: false },
    }),
    methods: {},
};
</script>
