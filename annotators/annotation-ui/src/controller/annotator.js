import {
  getAllocationForUser,
  getUserAnnotationsForPost,
} from "../repository/allocation";
import { saveAnnotations } from "../repository/annotation";
import _ from "lodash";
import { getUserStatus } from "../repository/user";
import { saveSession } from "../repository/session";

const DEFAULT_SESSION_VALUE = {
  postId: undefined, // for the post that was being annoted most recently
  postIndex: 0, // current post's index within this page of results
  pageNum: 0, // pageNum on which this post exists
};
const PAGESIZE = 20;

const ANNOTATOR_STATUS = {
  OK: {
    type: "ok",
    message: "Everything looks ok.",
  },
  LOADING_PAGE: {
    type: "loading",
    message: "Loading Post and User Annotations",
  },
  LOADING_SAVE_ANNOTATIONS: {
    type: "loading",
    message: "Saving your Annotations",
  },
  ERROR: { type: "error", message: "Error performing operations" },
  ERROR_SETUP_ANNOTATOR: {
    type: "error",
    message: "Could not get your posts. Refresh or Try again later.",
  },
  ERROR_MAKE_PAGE_DATA: {
    type: "error",
    message:
      "Could not get your annotations for this post. Refresh or Try again later.",
  },
  ERROR_SAVE_ANNOTATIONS: {
    type: "error",
    message: "Could not save your annotations. Refresh or Try again later.",
  },
};

/*
Session includes all information you would need to resume an annotation session. 
If undefined, the annotator assumes this is a new session and assigns variables accordingly.
session : {
    activePostId : 0,
    activePostIndexInPage : 3,
    activePostPageNum : 10
}
*/

class Annotator {
  constructor(user, session) {
    this.user = user;
    this.session = session ? session : DEFAULT_SESSION_VALUE;
    this.pageSize = PAGESIZE;
    this.annotation = undefined;
    this.currentAnnotations = undefined;
  }

  async setup() {
    const { allocations, count } = await getAllocationForUser(
      this.user.id,
      this.session.pageNum
    );
    this.allocations = allocations;
    this.postCount = count;
    this.pageCount = Math.ceil(count / this.pageSize); // total number of pages that this user can annotate
    this.session.postId = this.allocations[this.session.postIndex].postId;
  }

  async makePageData(postId) {
    const { annotations: annotationRes, error } =
      await getUserAnnotationsForPost(this.user.id, postId);
    if (error) {
      console.log("----> 2 ", error);
      return { error };
    } else {
      var annotations = {};
      annotationRes.map((annotation) => {
        annotations[annotation.key] = {
          id: annotation.id,
          value: annotation.value,
          key: annotation.key,
        };
      });

      this.currentAnnotations = annotations;

      const pageStatus = `${
        this.pageSize * this.session.pageNum + this.session.postIndex + 1
      }/${this.postCount}`;

      const post = this.allocations[this.session.postIndex].Post;

      const { status: userStatus } = await getUserStatus(this.user.id);
      console.log({ userStatus });

      return { data: { annotations, pageStatus, post, userStatus } };
    }
  }

  /**
   * Check if annotator has reached the end of the current page (session.postIndexLocal == pageSize)
   * if no,
   *    update the fields in the session variable (postIndex++; postId = currentAllocation[postIndex])
   *    return true
   * if yes,
   *    check if you are on the last page (pageNum == totalPageCount)
   *    if no,
   *        get the next allocation page and update the session variables
   *        return true
   *    if yes
   *        return false
   */
  async next() {
    if (this.session.postIndex === this.pageSize - 1) {
      if (this.session.pageNum === this.pageCount) {
        return undefined;
      } else {
        this.session.pageNum++;
        const { allocations } = await getAllocationForUser(
          this.user.id,
          this.session.pageNum
        );
        this.allocations = allocations;
        this.session.postIndex = 0;
        this.session.postId = this.allocations[0].postId;
      }
    } else {
      if (this.session.postIndex !== this.allocations.length - 1) {
        this.session.postIndex++;
        this.session.postId = this.allocations[this.session.postIndex].postId;
      } else {
        return undefined;
      }
    }

    // return await this.makePageData(this.session.postId);
  }

  /**
   * Check if annotator has reached the start of the current page ()
   * if no,
   *    update the fields in the session variable
   *    return page data
   * if yes,
   *    check if annotator has reached the first page
   *    if yes,
   *        return undefined
   *    if no,
   *        return get the previous allocation page and update the session variables
   *        return page data
   */
  async previous() {
    if (this.session.postIndex === 0) {
      if (this.session.pageNum === 0) {
        return undefined;
      } else {
        this.session.pageNum--;
        const { allocations, count } = await getAllocationForUser(
          this.user.id,
          this.session.pageNum
        );
        this.allocations = allocations;
        this.session.postIndex = this.pageSize - 1;
        this.session.postId = this.allocations[this.session.postIndex].postId;
      }
    } else {
      this.session.postIndex--;
      this.session.postId = this.allocations[this.session.postIndex].postId;
    }

    // return await this.makePageData(this.session.postId);
  }

  /**
   * Check if the annotations have changed. if they have, make an API call to save the annotations.
   */
  async saveAnnotations(annotations) {
    return saveAnnotations(this.user.id, this.session.postId, annotations);
  }

  /**
   *
   * Checks whether the annotations have changed on the UI vs the database.
   * If it has changed, this function returns the diff and if not false
   */
  haveAnnotationsChanged(annotations) {
    console.log({ annotations, current: this.currentAnnotations });
    let annotationArray = Object.keys(annotations).map(
      (key) => annotations[key]
    );
    let currentAnnotationsArray = Object.keys(this.currentAnnotations).map(
      (key) => this.currentAnnotations[key]
    );

    let diff = _.difference(annotationArray, currentAnnotationsArray);

    if (diff.length !== 0) {
      return diff;
    } else {
      return false;
    }
  }

  async saveSession() {
    console.log("saving session");
    console.log({ session: this.session });
    return saveSession(this.user.id, this.session);
  }

  /**
   * Gets post from local storage and syncs them with the backend
   */
  async sync() {}

  get state() {
    return {
      user: this.user,
      session: this.session,
      allocations: this.allocations,
      pageCount: this.pageCount,
      currentAnnotations: this.currentAnnotations,
    };
  }
}

export { Annotator, ANNOTATOR_STATUS };
