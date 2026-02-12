/**
 * Copyright (c) Microsoft Corporation.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import React, { useCallback, useState } from 'react';
import { CopyToClipboard } from './copyToClipboard';
import * as icons from './icons';
import './authToken.css';

const FIXED_AUTH_TOKEN_KEY = 'auth-token-fixed';
const DISABLE_AUTH_TOKEN_CHECK_KEY = 'auth-token-disable-check';

function parseBooleanValue(value: string | null | undefined): boolean {
  return /^(1|true|yes|on)$/i.test((value || '').trim());
}

export function getFixedAuthToken(): string | null {
  const token = localStorage.getItem(FIXED_AUTH_TOKEN_KEY);
  if (!token)
    return null;
  const trimmed = token.trim();
  return trimmed || null;
}

export function isAuthTokenCheckDisabled(): boolean {
  return parseBooleanValue(localStorage.getItem(DISABLE_AUTH_TOKEN_CHECK_KEY));
}

function setFixedAuthToken(token: string | null): void {
  if (!token || !token.trim()) {
    localStorage.removeItem(FIXED_AUTH_TOKEN_KEY);
    return;
  }
  localStorage.setItem(FIXED_AUTH_TOKEN_KEY, token.trim());
}

function setDisableAuthTokenCheck(value: boolean): void {
  if (value) {
    localStorage.setItem(DISABLE_AUTH_TOKEN_CHECK_KEY, 'true');
    return;
  }
  localStorage.removeItem(DISABLE_AUTH_TOKEN_CHECK_KEY);
}

export const AuthTokenSection: React.FC<{}> = ({}) => {
  const [authToken, setAuthToken] = useState<string>(getOrCreateAuthToken);
  const [isExampleExpanded, setIsExampleExpanded] = useState<boolean>(false);
  const [fixedAuthToken, setFixedAuthTokenState] = useState<string | null>(() => getFixedAuthToken());
  const [fixedAuthTokenInput, setFixedAuthTokenInput] = useState<string>(() => getFixedAuthToken() || '');
  const [tokenCheckDisabled, setTokenCheckDisabled] = useState<boolean>(() => isAuthTokenCheckDisabled());

  const onRegenerateToken = useCallback(() => {
    if (fixedAuthToken)
      return;
    const newToken = generateAuthToken();
    localStorage.setItem('auth-token', newToken);
    setAuthToken(newToken);
  }, [fixedAuthToken]);

  const onSaveFixedToken = useCallback(() => {
    const value = fixedAuthTokenInput.trim();
    setFixedAuthToken(value || null);
    setFixedAuthTokenState(value || null);
    setAuthToken(getOrCreateAuthToken());
  }, [fixedAuthTokenInput]);

  const onClearFixedToken = useCallback(() => {
    setFixedAuthToken(null);
    setFixedAuthTokenState(null);
    setFixedAuthTokenInput('');
    setAuthToken(getOrCreateAuthToken());
  }, []);

  const onToggleDisableTokenCheck = useCallback(() => {
    const next = !tokenCheckDisabled;
    setDisableAuthTokenCheck(next);
    setTokenCheckDisabled(next);
  }, [tokenCheckDisabled]);

  const toggleExample = useCallback(() => {
    setIsExampleExpanded(!isExampleExpanded);
  }, [isExampleExpanded]);

  return (
    <div className='auth-token-section'>
      <div className='auth-token-description'>
        {fixedAuthToken ?
          'Using fixed token configured in this browser profile:' :
          'Set this environment variable to bypass the connection dialog:'}
      </div>
      <div className='auth-token-container'>
        <code className='auth-token-code'>{authTokenCode(authToken)}</code>
        <button
          className='auth-token-refresh'
          title={fixedAuthToken ? 'Fixed token mode is enabled' : 'Generate new token'}
          aria-label={fixedAuthToken ? 'Fixed token mode is enabled' : 'Generate new token'}
          onClick={onRegenerateToken}
          disabled={!!fixedAuthToken}
        >
          {icons.refresh()}
        </button>
        <CopyToClipboard value={authTokenCode(authToken)} />
      </div>
      <div className='auth-token-description auth-token-top-margin'>
        Optional: set a shared fixed token (use the same value on your M4 and M1 Macs).
      </div>
      <div className='auth-token-container'>
        <input
          className='auth-token-input'
          type='text'
          value={fixedAuthTokenInput}
          placeholder='Paste shared token value'
          onChange={(e) => setFixedAuthTokenInput(e.target.value)}
        />
        <button className='auth-token-small-button' onClick={onSaveFixedToken}>Save</button>
        <button className='auth-token-small-button' onClick={onClearFixedToken} disabled={!fixedAuthToken}>Clear</button>
      </div>
      <div className='auth-token-description auth-token-top-margin'>
        Optional: disable token verification entirely (less secure).
      </div>
      <div className='auth-token-container'>
        <label className='auth-token-toggle-label'>
          <input type='checkbox' checked={tokenCheckDisabled} onChange={onToggleDisableTokenCheck} />
          Disable token check (auto-accept connections)
        </label>
      </div>

      <div className='auth-token-example-section'>
        <button
          className='auth-token-example-toggle'
          onClick={toggleExample}
          aria-expanded={isExampleExpanded}
          title={isExampleExpanded ? 'Hide example config' : 'Show example config'}
        >
          <span className={`auth-token-chevron ${isExampleExpanded ? 'expanded' : ''}`}>
            {icons.chevronDown()}
          </span>
          Example MCP server configuration
        </button>

        {isExampleExpanded && (
          <div className='auth-token-example-content'>
            <div className='auth-token-example-description'>
              Add this configuration to your MCP client (e.g., VS Code) to connect to the Playwright MCP Bridge:
            </div>
            <div className='auth-token-example-config'>
              <code className='auth-token-example-code'>{exampleConfig(authToken)}</code>
              <CopyToClipboard value={exampleConfig(authToken)} />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

function authTokenCode(authToken: string) {
  return `PLAYWRIGHT_MCP_EXTENSION_TOKEN=${authToken}`;
}

function exampleConfig(authToken: string) {
  return `{
  "mcpServers": {
    "playwright": {
      "command": "npx",
      "args": ["@playwright/mcp@latest", "--extension"],
      "env": {
        "PLAYWRIGHT_MCP_EXTENSION_TOKEN":
          "${authToken}"
      }
    }
  }
}`;
}

function generateAuthToken(): string {
  // Generate a cryptographically secure random token
  const array = new Uint8Array(32);
  crypto.getRandomValues(array);
  // Convert to base64 and make it URL-safe
  return btoa(String.fromCharCode.apply(null, Array.from(array)))
      .replace(/[+/=]/g, match => {
        switch (match) {
          case '+': return '-';
          case '/': return '_';
          case '=': return '';
          default: return match;
        }
      });
}

export const getOrCreateAuthToken = (): string => {
  const fixedToken = getFixedAuthToken();
  if (fixedToken)
    return fixedToken;
  let token = localStorage.getItem('auth-token');
  if (!token) {
    token = generateAuthToken();
    localStorage.setItem('auth-token', token);
  }
  return token;
}
