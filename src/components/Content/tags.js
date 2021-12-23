import React from 'react';
import PropTypes from 'prop-types';
import {observer} from 'mobx-react-lite';
import {uniq} from 'lodash';
import {getValueFromStore, usePatchOperation} from '../../utils/selectors';
import {Button, Icon} from '@blueprintjs/core';
import {TagSuggest} from '../Pickers';
import {NodeCategories, nodeOperations} from '../../datasets/tree';
import {Popover2} from '@blueprintjs/popover2';

const Tags = observer(({relativeJsonPath, node}) => {
  const handlePatch = usePatchOperation();
  const getTags = React.useCallback(() => {
    let tags =
      getValueFromStore(relativeJsonPath.concat(['tags']), false) || [];
    if (relativeJsonPath.length === 0) {
      tags = tags.map((i) => i.name);
    }
    return tags;
  }, [relativeJsonPath]);

  const getSuggestions = React.useCallback(
    (tags) => {
      let globalTags = getValueFromStore(['tags'], false) || [];
      globalTags = globalTags.map((i) => i.name);
      return uniq([...tags, ...globalTags]);
    },
    [relativeJsonPath],
  );

  const tags = getTags();
  const suggestedTags = getSuggestions(tags);

  const displayTags = (tags) => {
    if (tags && tags.length > 1) {
      return `${tags[0]} + ${tags.length - 1}`;
    }
    return tags.length ? tags[0] : tags;
  };

  return (
    <Popover2
      content={
        <TagSuggest
          className="tag-suggest"
          popoverClassname="tagpopover"
          items={suggestedTags}
          selectedItems={tags}
          onItemSelect={(item) => {
            let toSave = [...tags, item];
            if (node.category !== NodeCategories.SourceMap) {
              toSave = toSave.map((i) => ({name: i}));
            }
            handlePatch(
              nodeOperations.Add,
              relativeJsonPath.concat(['tags']),
              toSave,
            );
          }}
          onItemRemove={(item) => {
            let remaining = tags.filter((t) => t !== item);
            if (node.category !== NodeCategories.SourceMap) {
              remaining = remaining.map((t) => ({name: t}));
            }
            handlePatch(
              nodeOperations.Replace,
              relativeJsonPath.concat(['tags']),
              remaining,
            );
          }}
        />
      }
      placement="bottom">
      <Button
        small
        aria-label="tags"
        className="max-w-xs mr-3 truncate"
        icon={<Icon size={14} icon="tag" />}
        text={displayTags(tags)}
      />
    </Popover2>
  );
});

Tags.propTypes = {
  relativeJsonPath: PropTypes.array,
  node: PropTypes.object,
};

export default Tags;
