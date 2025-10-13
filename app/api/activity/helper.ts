import { ActivityTagQueries } from "@/lib/db/queries/activityTag";
import { TagQueries } from "@/lib/db/queries/tag";
import { Tag } from "@/lib/db/schema";

export const addTagsToActivity = async (
  activityId: number,
  tags: Tag[]
): Promise<void> => {
  const tagsToBeLinked = [] as Tag[];

  for (const tag of tags) {
    if (tag.id != -1) {
      // existing tag
      tagsToBeLinked.push(tag);
    } else {
      // new tag - create it
      const createdTag = await TagQueries.createTag(tag);
      tagsToBeLinked.push(createdTag);
    }
  }
  await ActivityTagQueries.unlinkTagsFromActivity(activityId);
  await ActivityTagQueries.linkTagsToActivity(activityId, tagsToBeLinked);
};
