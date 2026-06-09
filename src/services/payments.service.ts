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
      planCode
      planName
      status
      billingPeriod
      startedAt
      nextReviewAt
    }
  }
`;

export const REQUEST_PLAN_CHANGE = gql`
  mutation RequestPlanChange($input: RequestPlanChangeInput!) {
    requestPlanChange(input: $input) {
      requestId
      requestedPlanCode
      requestedPlanName
      status
      comment
    }
  }
`;

export interface GqlTenantSubscription {
  planCode: string;
  planName: string;
  status: string;
  billingPeriod: string;
  startedAt: string;
  nextReviewAt: string;
}

export interface GqlSubscriptionPlan {
  code: string;
  name: string;
  description?: string | null;
  priceUsd: number;
  billingPeriod: string;
  audience?: string | null;
  included: string[];
}
