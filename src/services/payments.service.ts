import { gql } from '@apollo/client';

export const GET_SUBSCRIPTION_PLANS = gql`
  query GetSubscriptionPlans {
    subscriptionPlans {
      code
      name
      description
      priceUsd
      billingPeriod
      audience
      included
    }
  }
`;

export const GET_CURRENT_SUBSCRIPTION = gql`
  query GetCurrentTenantSubscription {
    currentTenantSubscription {
      id
      planCode
      status
      startedAt
      expiresAt
    }
  }
`;

export const REQUEST_PLAN_CHANGE = gql`
  mutation RequestPlanChange($input: RequestPlanChangeInput!) {
    requestPlanChange(input: $input) {
      id
      planCode
      status
      comment
    }
  }
`;

export interface GqlSubscriptionPlan {
  code: string;
  name: string;
  description?: string | null;
  priceUsd: number;
  billingPeriod: string;
  audience?: string | null;
  included: string[];
}
