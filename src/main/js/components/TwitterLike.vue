<template>
    <div class="w-25 center ba b--black-10" id="twitterlike" v-cloak>
        <p class="f1 tc loading v-cloak--block">Loading
            <span>.</span>
            <span>.</span>
            <span>.</span>
        </p>
        <!-- Only displayed after compiling -->
        <div class="v-cloak--hidden">
            <div class="pv2 tc bb b--black-10">
                <h1 class="ma0 f5 normal">TwitterLike | Compose New Tweet</h1>
            </div>
            <div class="bg-near-white pa3">
                <textarea name="tweet" v-model="tweet" rows="3" placeholder="Write your tweet" class="w-100 br2 ba b--black-10 pa2">
                </textarea>
                <div class="flex justify-end items-center">
                    <span class="black-70" v-bind:class="{'orange': underTwentyMark, 'light-red': underTenMark, 'red': tweetIsOutOfLowerRange}">{{ charactersRemaining }}</span>
                    <span class="black-70">/{{ maxTweetLength() }}</span>
                </div>
                <transition name="fade" mode="out-in">
                    <div v-if="photoHasBeenUploaded" class="bg-black-10 pa2 flex overflow-x-scroll" id="photo-area">
                        <figure v-for="(photo, index) in photos" class="ma0 mh1 relative flex items-center justify-center" style="flex-shrink: 0">
                            <button @click="removePhoto(index)" class="pointer dim bg-blue h1 w1 br-100 white flex items-center justify-center absolute absolute--fill mr-auto">
                                <i class="material-icons f6">close</i>
                            </button>
                            <img v-bind:src="photo" class="h3 w3" alt="Uploaded photo">
                        </figure>
                    </div>
                </transition>
                <input @change="handlePhotoUpload" ref="photoUpload" type="file" accept="image/*" multiple="true" class="dn">
                <div class="flex justify-end items-center">
                    <div class="flex pa1 mr-auto self-stretch items-center bt bw1 b--dark-red">
                        <button @click="triggerFileUpload" class="flex br2 pa1 items-center justify-center bg-transparent blue hover-bg-black-10 pointer">
                            <i class="material-icons f4">photo_camera</i>
                        </button>
                    </div>
                    <div class="flex pa1 bt bw1 b--dark-red">
                        <button :disabled="tweetIsOutOfRange" class="bg-blue white f6 fw5 pv2 ph3 br2 dim">Tweet</button>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import Vue from "vue"

import "css@/twitterlike.scss"

const MAX_TWEET_LENGTH = 140;

export default Vue.extend({
    /**
     * @returns {{tweet: string, photos: string[]}}
     */
    data() {
        return {
            tweet: "",
            photos: [
                "data:image/jpeg;base64,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"
            ]
        }
    },
    methods: {
        triggerFileUpload() {
            /**
             * @type {HTMLButtonElement}  
             **/
            let photoUploadLement = /** @type {HTMLButtonElement} */ (this.$refs.photoUpload); // TS Feature: Cast in JSDoc https://github.com/Microsoft/TypeScript/pull/17251
            photoUploadLement.click();
        },
        /**
         * @param {HTMLInputEvent} e 
         */
        handlePhotoUpload(e) {
            // e.target.files is NOT an array. But an array-like structure
            Array.prototype.forEach.call(e.target.files, (/** @type {File} */ file) => {
                var reader = new FileReader();
                /**
                 * @param {FileReaderEvent} e
                 */
                reader.onload = (e) => {
                    this.photos.push(e.target.result);
                }
                reader.readAsDataURL(file);
            });

            /* Reset the value(aka the file names) of the html input-file element.
               Else a file upload of the same name consecutively will not work after the first time.
               UC 1: user uploads a.jpg -> removePhoto -> user wants to upload 
               a.jpg again -> no change event is triggered. 
               UC 2: user uploads a.jpg -> user wants to upload 
               a.jpg again -> no change event is triggered. 
               Browser people seem settled to what a change is too literally :)
            */
            /**
             * @type {HTMLButtonElement}  
             **/
            let photoUploadLement = /** @type {HTMLButtonElement} */ (this.$refs.photoUpload); // TS Feature: Cast in JSDoc https://github.com/Microsoft/TypeScript/pull/17251
            photoUploadLement.value = "";
        },
        /**
         * @param {number} index 
         */
        removePhoto(index) {
            this.photos.splice(index, 1);
        },
        maxTweetLength() {
            return MAX_TWEET_LENGTH;
        }
    },
    computed: {
        /**@returns {boolean} */
        tweetIsOutOfUpperRange() {
            return this.tweet.length == 0;
        },
        /**@returns {boolean} */
        tweetIsOutOfLowerRange() {
            return this.charactersRemaining < 0;
        },
        /**@returns {boolean} */
        tweetIsOutOfRange() {
            return this.tweetIsOutOfLowerRange || this.tweetIsOutOfUpperRange;
        },
        /**@returns {number} */
        charactersRemaining() {
            return MAX_TWEET_LENGTH - this.tweet.length;
        },
        /**@returns {boolean} */
        underTwentyMark() {
            return this.charactersRemaining <= 20 && this.charactersRemaining >= 10;
        },
        /**@returns {boolean} */
        underTenMark() {
            return this.charactersRemaining < 10 && this.charactersRemaining >= 0;
        },
        /**@returns {boolean} */
        photoHasBeenUploaded() {
            return this.photos.length > 0;
        }
    }
});
</script>