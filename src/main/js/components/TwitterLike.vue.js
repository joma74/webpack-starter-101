import Vue from "vue";

import "css@/twitterlike.scss"

const MAX_TWEET_LENGTH = 140;

export default Vue.extend({
    template: `
        <p class="f1 tc loading v-cloak--block">Loading<span>.</span><span>.</span><span>.</span></p>
        <!-- Only displayed after compiling -->
        <div class="v-cloak--hidden">
            <div class="pv2 tc bb b--black-10">
                <h1 class="ma0 f5 normal">Compose new Tweet</h1>
            </div>
            <div class="bg-near-white pa3">
                <textarea name="tweet" v-model="tweet" rows="3" placeholder="Write your tweet" class="w-100 br2 ba b--black-10 pa2">
            </textarea>
                <transition name="fade" mode="out-in">
                <div v-if="photoHasBeenUploaded" class="bg-black-10 pa2 flex overflow-x-scroll" id="photo-area">
                    <figure v-for="(photo, index) in photos" class="ma0 mh1 relative flex items-center justify-center" style="flex-shrink: 0">
                    <button @click="removePhoto(index)" class="pointer dim bn bg-blue h1 w1 br-100 white flex items-center justify-center absolute absolute--fill mr-auto">
                    <i class="material-icons f6">close</i>
                </button>
                    <img v-bind:src="photo" class="h3 w3" alt="Uploaded photo">
                    </figure>
                </div>
                </transition>
                <input @change="handlePhotoUpload" ref="photoUpload" type="file" accept="image/*" multiple="true" class="dn">
                <div class="flex justify-end items-center mt3">
                <button @click="triggerFileUpload" class="mr-auto flex items-center justify-center br2 bn bg-transparent blue hover-bg-black-10 pointer"><i class="material-icons f3">photo_camera</i></button>
                <span class="mr3 black-70" v-bind:class="{'orange': underTwentyMark, 'light-red': underTenMark, 'red': tweetIsOutOfLowerRange}">{{ charactersRemaining }}</span>
                <button :disabled="tweetIsOutOfRange" class="bg-blue bn white f6 fw5 pv2 ph3 br2 dim">Tweet</button>
                </div>
            </div>
        </div>
    `,
    data() {
        return {
            tweet: "",
            /** @type {string[]} */
            photos: []
        }
    },
    methods: {
        triggerFileUpload() {
            /** @type {HTMLButtonElement} */
            var photoUploadLement = this.$refs.photoUpload;
            photoUploadLement.click();
        },
        /**
         * 
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
             * */
            var photoUploadLement = this.$refs.photoUpload;
            photoUploadLement.value = "";
        },
        /**
         * 
         * @param {number} index 
         */
        removePhoto(index) {
            this.photos.splice(index, 1);
        }
    },
    computed: {
        tweetIsOutOfUpperRange() {
            return this.tweet.length == 0;
        },
        tweetIsOutOfLowerRange() {
            return this.charactersRemaining() < 0;
        },
        tweetIsOutOfRange() {
            return this.tweetIsOutOfLowerRange || this.tweetIsOutOfUpperRange;
        },
        charactersRemaining() {
            return MAX_TWEET_LENGTH - this.tweet.length;
        },
        underTwentyMark() {
            return this.charactersRemaining() <= 20 && this.charactersRemaining() >= 10;
        },
        underTenMark() {
            return this.charactersRemaining() < 10 && this.charactersRemaining() >= 0;
        },
        photoHasBeenUploaded() {
            return this.photos.length > 0;
        },
    }
})
