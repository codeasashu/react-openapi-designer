import React from 'react';
import {observer} from 'mobx-react';
import {DiagnosticSeverity} from '@stoplight/types';
import {InputGroup, Tag} from '@blueprintjs/core';
import {basicSearch} from '../../../utils';
import {StoresContext} from '../../Context';
import Header from './header';
import Row from './row';

const Panel = observer(() => {
  const stores = React.useContext(StoresContext);
  const [filterSearch, setFilterSearch] = React.useState('');
  const [hiddenItems, setHiddenItems] = React.useState(0);
  const {errors, warning, info, hints} = stores.lintStore;
  const [resultList, setResultList] = React.useState([
    ...errors,
    ...warning,
    ...info,
    ...hints,
  ]);
  const totalItems = [...errors, ...warning, ...info, ...hints].length;
  const searchEngine = basicSearch(resultList, 'message');

  const resetResults = () => {
    setResultList([...errors, ...warning, ...info, ...hints]);
  };

  React.useEffect(() => {
    if (resultList.length !== totalItems) {
      setHiddenItems(totalItems - resultList.length);
    } else {
      setHiddenItems(0);
    }
  }, [resultList]);

  const filterResults = (severity) => {
    let filtered = [...errors, ...warning, ...info, ...hints];
    if (resultList.length === totalItems) {
      filtered = filtered.filter((i) => i.severity === severity);
    }

    setResultList(filtered);
  };

  const performSearch = React.useCallback(
    (term) => {
      setFilterSearch(term);
      if (term && resultList.length) {
        const matches = searchEngine(term);
        setResultList(matches);
      } else {
        resetResults();
      }
    },
    [filterSearch],
  );

  const removeHidden = () => {
    resetResults();
    setFilterSearch('');
  };

  return (
    <>
      <Header onClick={(severity) => filterResults(severity)}>
        <InputGroup
          small
          className="ml-3 mr-2 pr-1"
          placeholder="Search results..."
          value={filterSearch}
          onChange={(e) => performSearch(e.target.value)}
        />
        {hiddenItems > 0 && (
          <Tag minimal interactive onRemove={removeHidden}>
            {hiddenItems} hidden
          </Tag>
        )}
      </Header>
      <div>
        <div className="flex font-semibold text-sm text-gray-7 dark:text-gray-4 pt-4 pb-2 pl-4 pr-8 text-center">
          <div className="py-2 text-centerPanel" style={{width: '5%'}}>
            Type
          </div>
          <div className="py-2 text-centerPanel" style={{width: '15%'}}>
            Line
          </div>
          <div className="py-2 flex flex-1 truncate items-center">
            <div>Message</div>
            <div className="flex-1 flex justify-end pl-2">Actions</div>
          </div>
        </div>
        <div className="qa-diagnostics-panel w-full h-full">
          {resultList
            .filter((i) => i.severity === DiagnosticSeverity.Error)
            .map((error, i) => (
              <Row key={i} result={error} />
            ))}
          {resultList
            .filter((i) => i.severity === DiagnosticSeverity.Warning)
            .map((data, i) => (
              <Row key={i} result={data} />
            ))}
          {resultList
            .filter((i) => i.severity === DiagnosticSeverity.Information)
            .map((data, i) => (
              <Row key={i} result={data} />
            ))}
          {resultList
            .filter((i) => i.severity === DiagnosticSeverity.Hint)
            .map((data, i) => (
              <Row key={i} result={data} />
            ))}
        </div>
      </div>
    </>
  );
});

export default Panel;
