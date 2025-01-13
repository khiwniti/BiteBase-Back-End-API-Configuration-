import React, { useEffect, useState } from 'react';
import { fetchApiList } from '../config/backendConfig';

const ApiList: React.FC = () => {
  const [apis, setApis] = useState([]);

  useEffect(() => {
    const getApis = async () => {
      try {
        const apiList = await fetchApiList();
        setApis(apiList);
      } catch (error) {
        console.error('Error fetching API list:', error);
      }
    };

    getApis();
  }, []);

  return (
    <div>
      <h2>API List</h2>
      <ul>
        {apis.map((api, index) => (
          <li key={index}>
            <strong>{api.name}</strong> ({api.module_name}): {api.description} ({api.method} {api.path})
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ApiList;
