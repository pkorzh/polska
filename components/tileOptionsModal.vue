<template>
  <b-modal
    :title="tile.display_name"
    :visible="visible"
    @hidden="$emit('hide')"
    @change="change"
    hide-footer
  >
    <ul>
      <li>
        <a href="javascript:void(0)" @click="share">
          <fa :icon="['fas', 'share']" />
          Share
        </a>
      </li>
      <li>
        <a href="javascript:void(0)" @click="report">
          <fa :icon="['fas', 'bug']" />
          Report a problem
        </a>
      </li>
    </ul>
    <b-modal title="Report a problem" v-model="showReportModal" hide-footer >
      <form action @submit="onSubmitReport" :disabled="isSubmittingReport">
        <div class="form__area" v-for="(option, index) in options" :key="index">
          <input type="radio" :id="'opt' + index" :value="option" v-model="form.option" class="form__radio" />
          <label :for="'opt' + index">{{ option }}</label>
        </div>
        <textarea 
          v-model="form.comment" 
          placeholder="Type in here..." 
          class="form__textarea" 
          :disabled="isSubmittingReport"></textarea>

        <div class="form__button">
          <input 
            type="submit" 
            :value="!isSubmittingReport ? 'Submit' : 'Submitting'" 
            class="form__submit"
            :disabled="isSubmittingReport" />
        </div>
      </form>
    </b-modal>
    <b-modal title="Share" v-model="showShareModal" hide-footer>
      <ul>
        <li>
          <a href="javascript:void(0)" @click="copyToClipboard">
            <fa :icon="['fas', 'clipboard']" />
            Copy link
          </a>
        </li>
      </ul>
    </b-modal>
  </b-modal>
</template>

<script>
export default {
  data: () => ({
    showReportModal: false,
    showShareModal: false,
    form: {
      comment: null,
      option: null,
    },
    options: [
      "Picture is missing",
      "Other",
    ],
    isSubmittingReport: false,
  }),
  model: {
    prop: "visible"
  },
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    tile: {
      type: Object,
      required: true
    }
  },
  computed: {
    shareableUrl() {
      return `${location.protocol}//${location.hostname}${
        location.port ? ":" + location.port : ""
      }/tile/${this.tile.type}/${this.tile.id}`;
    }
  },
  methods: {
    hide() {
      this.showReportModal = false;
      this.showShareModal = false;
      this.$emit("hide");
    },
    change(visible) {
      this.$emit("change", visible);
    },
    async share() {
      if (navigator.share) {
        try {
          await navigator.share({
            title: this.tile.display_name,
            text: this.tile.display_name,
            url: this.shareableUrl
          });
        } catch {}
      } else {
        this.showShareModal = true;
      }
    },
    async copyToClipboard() {
      if (!navigator.clipboard) {
        const textArea = document.createElement("textarea");
        textArea.value = this.shareableUrl;

        textArea.style.top = "-900000000";
        textArea.style.left = "-999999999";
        textArea.style.position = "fixed";

        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();

        try {
          var successful = document.execCommand("copy");
          var msg = successful ? "successful" : "unsuccessful";
          console.log("Fallback: Copying text command was " + msg);
        } catch (err) {
          console.error("Fallback: Oops, unable to copy", err);
        }

        document.body.removeChild(textArea);
      } else {
        await navigator.clipboard.writeText(this.shareableUrl);
      }

      this.hide();
    },
    report() {
      this.showReportModal = true;
    },
    async onSubmitReport(evt) {
      evt.preventDefault();

      if (this.isSubmittingReport) {
        return
      }

      this.isSubmittingReport = true

      try {
        await this.$axios.$post("/api/report_a_problem", {
          comment: this.form.comment,
          option: this.form.option,
          tile: this.shareableUrl
        });
      } catch {}

      this.isSubmittingReport = false
      this.form.comment = null
      this.form.option = null
      this.hide();
    }
  }
};
</script>

<style></style>
