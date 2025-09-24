declare module '@arcblock/ux/*';

interface ComponentMountPoint {
  did: string;
  name: string;
  mountPoint: string;
  status: 'running' | 'starting';
}

interface Window {
  __discuss_kit_client_id__?: string;
  blocklet: {
    appId: string;
    appPid: string;
    appLogo: string;
    prefix: string;
    appUrl: string;
    appName: string;
    appDescription: string;
    componentMountPoints: ComponentMountPoint[];
    pageGroup: 'blog' | 'discussion' | 'doc' | 'bookmark' | undefined;
    capabilities: Record<string, any>;
    preferences: {
      maxCommentLength: number;
      allowDeleteComment: boolean;
      allowEditComment: boolean;
      allowImageComment: boolean;
      maxDiscussionLength: number;
      maxPinLimit: number;
      maxFeaturedLimit: number;
      discussMode: 'knowledge-base' | 'BBS';
      postsViewMode: 'nested' | 'flat';
      allowDeleteDiscussion: boolean;
      allowEditDiscussion: boolean;
      allowNewDiscussion: boolean;
      allowLockDiscussion: boolean;
      allowPublishBlog: boolean;
      displayBlogComments: boolean;
      displayLabelFilterOnBlogList: boolean;
      blogListStyle: 'default';
      displayAuthorOnBlogList: boolean;
      displayLabelsOnBlogList: boolean;
      displayPublishTimeFilterOnBlogList: boolean;
      displayBoardsOnBlogList: boolean;
      displaySortingOnBlogList: boolean;
      displayAuthorOnBlog: boolean;
      displayLabelsOnBlog: boolean;
      displayBoardOnBlog: boolean;
      displayBackButtonOnBlog: boolean;
      displayConnectButtonOnBlog: boolean;
      displayReactionOnBlog: boolean;
      displayReplyButtonForAnonymousUsers: boolean;
      enableNotificationBadge: boolean;
      enableAISearch: boolean;
      enableDiscussLog: boolean;
      discussLogPosition: 'standard' | 'top';
      enableDiscussPostLog: boolean;
      enableDiscussCommentLog: boolean;
      enableBlogLog: boolean;
      blogLogPosition: 'standard' | 'top';
      enableBlogPostLog: boolean;
      enableBlogCommentLog: boolean;
      enableDocsLog: boolean;
      docsLogPosition: 'standard' | 'top';
      enableDocsPostLog: boolean;
      enableDocsCommentLog: boolean;
      badgeList: any[];
      socialShareButtonsDiscussion: boolean;
      socialShareButtonsBlog: boolean;
      socialShareButtonsDoc: boolean;
      blogListTemplate: 'standard' | 'corp';
      blogTemplate: 'standard' | 'corp';
      primaryColor: string;
      secondaryColor: string;
      subscriptionPublicType: 'blur' | 'slice';
      enableAssignmentDiscussion: boolean;
      enableAssignmentBlog: boolean;
      enableAssignmentDoc: boolean;

      bannerTitleDiscussionEn: string;
      bannerTitleDiscussionZh: string;
      bannerDescDiscussionEn: string;
      bannerDescDiscussionZh: string;

      bannerTitleBlogEn: string;
      bannerTitleBlogZh: string;
      bannerDescBlogEn: string;
      bannerDescBlogZh: string;

      bannerTitleDocEn: string;
      bannerTitleDocZh: string;
      bannerDescDocEn: string;
      bannerDescDocZh: string;

      bannerTitleBookmarkEn: string;
      bannerTitleBookmarkZh: string;
      bannerDescBookmarkEn: string;
      bannerDescBookmarkZh: string;

      discussionsVisiblePostTypes: string[];

      allowDonationOnDiscussion: boolean;
      allowDonationOnBlog: boolean;
      allowDonationOnDoc: boolean;
      allowDonationOnBookmark: boolean;
      allowDonationAmountCustom: boolean;
      discussionDonationButtonText: string;
      discussionDonationHistoryStyle: string;
      discussionDonationMaximum: string;
      discussionDonationMinimum: string;
      discussionDonationPresets: string;

      discussionEnabled: boolean;
      blogEnabled: boolean;
      docEnabled: boolean;
      bookmarkEnabled: boolean;
      chatEnabled: boolean;

      assignmentAuthorizedPassports: string[];

      translatorAgentAid?: string;
      inlineTranslatorAgentAid?: string;
    };
  };

  chatInWallet?: {
    safeAreaInsetTop?: string;
  };

  uploaderRef?: any;
}
