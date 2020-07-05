import React from 'react';
import { storiesOf } from '@storybook/react';
import { action } from '@storybook/addon-actions';
import AutoComplete, { DataSourceType } from './autoComplete';

interface LakerPlayersProps {
  value: string;
  number: number;
};

interface UsersProps {
  login: string;
  url: string;
  id: string;
}

const SimpleComplete = () => {
  const lakers = ['bradley', 'pope', 'caruso', 'cook', 'cousins', 'james', 'AD', 'green', 'howard', 'kuzma', 'McGee', 'rando'];
  const handleFetch = (keyword: string) => {
    return lakers.filter(name => name.includes(keyword)).map(name => ({ value: name }));
  }
  return (
    <AutoComplete
      onSelect={action('selected')}
      fetchSuggestions={handleFetch}
    />
  );
}

const ObjectComplete = () => {
  const lakersWithNumber = [
    { value: 'bradley', number: 11 },
    { value: 'pope', number: 1 },
    { value: 'caruso', number: 4 },
    { value: 'cook', number: 2 },
    { value: 'cousins', number: 15 },
    { value: 'james', number: 23 },
    { value: 'AD', number: 3 },
    { value: 'green', number: 14 },
    { value: 'howard', number: 39 },
    { value: 'kuzma', number: 0 },
  ];
  const handleFetch = (keyword: string) => {
    return lakersWithNumber.filter(player => player.value.includes(keyword))
  }
  const renderOption = (item: DataSourceType) => {
    const itemWithNumber = item as DataSourceType<LakerPlayersProps>;
    return (
      <>
      <h5>Name: {itemWithNumber.value}</h5>
      <span>Number: {itemWithNumber.number}</span>
      </>
    );
  };
  return (
    <AutoComplete
      onSelect={action('selected')}
      fetchSuggestions={handleFetch}
      renderOption={renderOption}
    />
  );
}

const fetchComplete = () => {
  const handleFetch = (keyword: string) => {
    return fetch(`https://api.github.com/search/users?q=${keyword}`)
      .then(res => res.json())
      .then(({ items }) => {
        console.log(items);
        return items.slice(0, 10).map((item: UsersProps) => ({ ...item, value: item.login }));
      })
  }
  const renderOption = (item: DataSourceType) => {
    const user = item as DataSourceType<UsersProps>;
    return (
      <>
        <h5>{user.login} - <span>{user.id}</span></h5>
        <p>{user.url}</p>
      </>
    );
  }
  return (
    <AutoComplete
      onSelect={action('selected')}
      fetchSuggestions={handleFetch}
      renderOption={renderOption}
    />
  );
}

storiesOf('AutoComplete', module)
  .add('AutoComplete', SimpleComplete)
  .add('对象型数据自动补全', ObjectComplete)
  .add('异步请求数据自动补全', fetchComplete)
